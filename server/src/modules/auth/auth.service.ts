import { compareSync, hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

import { pool } from "../../config/db";
import { getFirstLevelId, getUnlockableZoneIdsByLevel } from "../../data/course-content";
import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";

const authSchema = z.object({
  username: z.string().trim().min(3).max(20),
  password: z.string().trim().min(6).max(32),
});

type UserRow = RowDataPacket & {
  id: string;
  username: string;
  password_hash: string;
  level: number;
  xp: number;
};

function toPublicUser(user: Pick<UserRow, "id" | "username" | "level" | "xp">) {
  return {
    id: user.id,
    username: user.username,
    level: user.level,
    xp: user.xp,
  };
}

async function getUserByUsername(username: string, connection?: PoolConnection) {
  const executor = connection ?? pool;
  const [rows] = await executor.execute<UserRow[]>(
    `
      SELECT id, username, password_hash, level, xp
      FROM users
      WHERE username = ?
      LIMIT 1
    `,
    [username],
  );

  return rows[0] ?? null;
}

export async function register(input: unknown) {
  const payload = authSchema.parse(input);
  const exists = await getUserByUsername(payload.username);

  if (exists) {
    throw new AppError("Username already exists", 409);
  }

  const user = {
    id: randomUUID(),
    username: payload.username,
    passwordHash: hashSync(payload.password, 10),
    level: 1,
    xp: 0,
  };
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `
        INSERT INTO users (id, username, password_hash, level, xp, status)
        VALUES (?, ?, ?, ?, ?, 'active')
      `,
      [user.id, user.username, user.passwordHash, user.level, user.xp],
    );

    const firstLevelId = getFirstLevelId();
    if (!firstLevelId) {
      throw new AppError("No levels configured in the system", 500);
    }

    await connection.execute(
      `
        INSERT INTO user_level_progress (id, user_id, current_level_id)
        VALUES (?, ?, ?)
      `,
      [randomUUID(), user.id, firstLevelId],
    );

    const zoneIdsToUnlock = getUnlockableZoneIdsByLevel(user.level);
    if (zoneIdsToUnlock.length > 0) {
      const placeholders = zoneIdsToUnlock.map(() => "(?, ?, ?)").join(", ");
      const values = zoneIdsToUnlock.flatMap((zoneId) => [
        randomUUID(),
        user.id,
        zoneId,
      ]);
      await connection.execute(
        `INSERT INTO user_unlocked_zones (id, user_id, zone_id) VALUES ${placeholders}`,
        values,
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (
      typeof error === "object" &&
      error !== null &&
      "errno" in error &&
      (error as { errno: number }).errno === 1062
    ) {
      // Only re-check the username-specific duplicate key
      const exists = await getUserByUsername(user.username);
      if (exists) {
        throw new AppError("Username already exists", 409);
      }
    }
    throw error;
  } finally {
    connection.release();
  }

  return {
    user: toPublicUser({
      id: user.id,
      username: user.username,
      level: user.level,
      xp: user.xp,
    }),
  };
}

export async function login(input: unknown) {
  const payload = authSchema.parse(input);
  const user = await getUserByUsername(payload.username);

  if (!user || !compareSync(payload.password, user.password_hash)) {
    // Delay to slow down brute force attempts
    await new Promise((resolve) => setTimeout(resolve, 800));
    throw new AppError("Username or password is incorrect", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: toPublicUser(user),
  };
}
