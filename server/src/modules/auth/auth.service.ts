import { compareSync, hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

import { pool } from "../../config/db";
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

type LevelRow = RowDataPacket & {
  id: string;
};

type ZoneRow = RowDataPacket & {
  id: string;
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

    const [levelRows] = await connection.execute<LevelRow[]>(
      `
        SELECT id
        FROM levels
        WHERE status = 'active'
        ORDER BY sort_order ASC, created_at ASC
        LIMIT 1
      `,
    );

    const firstLevelId = levelRows[0]?.id ?? null;

    await connection.execute(
      `
        INSERT INTO user_level_progress (id, user_id, current_level_id)
        VALUES (?, ?, ?)
      `,
      [randomUUID(), user.id, firstLevelId],
    );

    const [zoneRows] = await connection.execute<ZoneRow[]>(
      `
        SELECT id
        FROM zones
        WHERE status = 'active' AND required_level <= ?
      `,
      [user.level],
    );

    for (const zone of zoneRows) {
      await connection.execute(
        `
          INSERT INTO user_unlocked_zones (id, user_id, zone_id)
          VALUES (?, ?, ?)
        `,
        [randomUUID(), user.id, zone.id],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
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
