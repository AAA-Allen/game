import type { RowDataPacket } from "mysql2/promise";

import { pool } from "../../config/db";
import { AppError } from "../../utils/app-error";

type UserRow = RowDataPacket & {
  id: string;
  level: number;
  xp: number;
};

type ProgressRow = RowDataPacket & {
  current_level_id: string | null;
};

type CompletedLevelRow = RowDataPacket & {
  level_id: string;
};

type UnlockedZoneRow = RowDataPacket & {
  zone_id: string;
};

export async function getCurrentProgress(userId: string) {
  const [userRowsResult, progressRowsResult, completedRowsResult, unlockedRowsResult] =
    await Promise.all([
    pool.execute<UserRow[]>(
      `
        SELECT id, level, xp
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [userId],
    ),
    pool.execute<ProgressRow[]>(
      `
        SELECT current_level_id
        FROM user_level_progress
        WHERE user_id = ?
        LIMIT 1
      `,
      [userId],
    ),
    pool.execute<CompletedLevelRow[]>(
      `
        SELECT level_id
        FROM user_completed_levels
        WHERE user_id = ?
        ORDER BY completed_at ASC
      `,
      [userId],
    ),
    pool.execute<UnlockedZoneRow[]>(
      `
        SELECT zone_id
        FROM user_unlocked_zones
        WHERE user_id = ?
        ORDER BY unlocked_at ASC
      `,
      [userId],
    ),
    ]);
  const [userRows] = userRowsResult;
  const [progressRows] = progressRowsResult;
  const [completedRows] = completedRowsResult;
  const [unlockedRows] = unlockedRowsResult;
  const user = userRows[0];
  const progress = progressRows[0];

  if (!user || !progress) {
    throw new AppError("Progress not found", 404);
  }

  return {
    userId,
    currentLevel: user.level,
    currentXp: user.xp,
    currentLevelId: progress.current_level_id ?? "",
    completedLevelIds: completedRows.map((item) => item.level_id),
    unlockedZoneIds: unlockedRows.map((item) => item.zone_id),
  };
}
