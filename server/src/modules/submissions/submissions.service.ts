import { randomUUID } from "crypto";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

import { pool } from "../../config/db";
import { AppError } from "../../utils/app-error";
import { getLevelById } from "../levels/levels.service";

const submissionSchema = z.object({
  levelId: z.string().min(1),
  html: z.string(),
  css: z.string(),
  javascript: z.string(),
});

function calculateLevel(xp: number) {
  return Math.floor(xp / 50) + 1;
}

type UserRow = RowDataPacket & {
  id: string;
  level: number;
  xp: number;
};

type ProgressRow = RowDataPacket & {
  id: string;
  current_level_id: string | null;
};

type CompletedLevelRow = RowDataPacket & {
  level_id: string;
};

type NextLevelRow = RowDataPacket & {
  id: string;
};

async function getCompletedLevelIds(
  connection: PoolConnection,
  userId: string,
) {
  const [rows] = await connection.execute<CompletedLevelRow[]>(
    `
      SELECT level_id
      FROM user_completed_levels
      WHERE user_id = ?
      ORDER BY completed_at ASC
    `,
    [userId],
  );

  return rows.map((item) => item.level_id);
}

async function getNextCurrentLevelId(
  connection: PoolConnection,
  userId: string,
) {
  const [rows] = await connection.execute<NextLevelRow[]>(
    `
      SELECT l.id
      FROM levels l
      LEFT JOIN user_completed_levels ucl
        ON ucl.level_id = l.id
       AND ucl.user_id = ?
      WHERE l.status = 'active'
        AND ucl.id IS NULL
      ORDER BY l.sort_order ASC, l.created_at ASC
      LIMIT 1
    `,
    [userId],
  );

  return rows[0]?.id ?? null;
}

export async function createSubmission(userId: string, input: unknown) {
  const payload = submissionSchema.parse(input);
  const level = getLevelById(payload.levelId);
  const fullCode = `${payload.html}\n${payload.css}\n${payload.javascript}`;
  const matchedRules = level.requiredKeywords.filter((keyword) =>
    fullCode.includes(keyword),
  );
  const totalRules = level.requiredKeywords.length;
  const passed = totalRules === 0 || matchedRules.length === totalRules;
  const score =
    totalRules === 0 ? 100 : Math.round((matchedRules.length / totalRules) * 100);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userRowsResult, progressRowsResult] = await Promise.all([
      connection.execute<UserRow[]>(
        `
          SELECT id, level, xp
          FROM users
          WHERE id = ?
          LIMIT 1
          FOR UPDATE
        `,
        [userId],
      ),
      connection.execute<ProgressRow[]>(
        `
          SELECT id, current_level_id
          FROM user_level_progress
          WHERE user_id = ?
          LIMIT 1
          FOR UPDATE
        `,
        [userId],
      ),
    ]);
    const [userRows] = userRowsResult;
    const [progressRows] = progressRowsResult;
    const user = userRows[0];
    const progress = progressRows[0];

    if (!user || !progress) {
      throw new AppError("User progress not found", 404);
    }

    const completedLevelIds = await getCompletedLevelIds(connection, userId);
    const alreadyCompleted = completedLevelIds.includes(level.id);
    const earnedXp = passed && !alreadyCompleted ? level.rewardXp : 0;

    let nextXp = user.xp;
    let nextLevel = user.level;

    if (passed && !alreadyCompleted) {
      nextXp += earnedXp;
      nextLevel = calculateLevel(nextXp);

      await connection.execute(
        `
          INSERT INTO user_completed_levels (id, user_id, level_id)
          VALUES (?, ?, ?)
        `,
        [randomUUID(), userId, level.id],
      );

      await connection.execute(
        `
          UPDATE users
          SET xp = ?, level = ?
          WHERE id = ?
        `,
        [nextXp, nextLevel, userId],
      );

      await connection.execute(
        `
          INSERT INTO xp_logs (
            id,
            user_id,
            source,
            source_id,
            amount,
            balance_after
          )
          VALUES (?, ?, 'level_clear', ?, ?, ?)
        `,
        [randomUUID(), userId, level.id, earnedXp, nextXp],
      );

      await connection.execute(
        `
          INSERT IGNORE INTO user_unlocked_zones (id, user_id, zone_id)
          SELECT UUID(), ?, z.id
          FROM zones z
          WHERE z.status = 'active' AND z.required_level <= ?
        `,
        [userId, nextLevel],
      );
    }

    const submissionId = randomUUID();
    await connection.execute(
      `
        INSERT INTO submissions (
          id,
          user_id,
          level_id,
          code_html,
          code_css,
          code_js,
          passed,
          score,
          earned_xp
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        submissionId,
        userId,
        level.id,
        payload.html,
        payload.css,
        payload.javascript,
        passed ? 1 : 0,
        score,
        earnedXp,
      ],
    );

    const nextCurrentLevelId =
      passed && !alreadyCompleted
        ? await getNextCurrentLevelId(connection, userId)
        : progress.current_level_id;

    await connection.execute(
      `
        UPDATE user_level_progress
        SET current_level_id = ?
        WHERE id = ?
      `,
      [nextCurrentLevelId, progress.id],
    );

    const refreshedCompletedLevelIds = await getCompletedLevelIds(connection, userId);

    await connection.commit();

    return {
      submission: {
        id: submissionId,
        userId,
        levelId: level.id,
        passed,
        score,
        earnedXp,
        submittedAt: new Date().toISOString(),
      },
      progress: {
        level: nextLevel,
        xp: nextXp,
        completedLevelIds: refreshedCompletedLevelIds,
      },
      feedback: passed
        ? alreadyCompleted
          ? "本关已经通过过了，这次记录为练习提交。"
          : "挑战成功，已发放经验奖励。"
        : "还缺少部分关键代码片段，继续调整后再提交。",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
