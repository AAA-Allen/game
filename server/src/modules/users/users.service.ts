import type { RowDataPacket } from "mysql2/promise";

import { pool } from "../../config/db";
import { AppError } from "../../utils/app-error";

type UserProfileRow = RowDataPacket & {
  id: string;
  username: string;
  level: number;
  xp: number;
};

export async function getUserProfile(userId: string) {
  const [rows] = await pool.execute<UserProfileRow[]>(
    `
      SELECT id, username, level, xp
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [userId],
  );
  const user = rows[0];

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    username: user.username,
    level: user.level,
    xp: user.xp,
  };
}
