import type { RowDataPacket } from "mysql2/promise";

import { pool } from "../../config/db";
import { AppError } from "../../utils/app-error";
import { deriveSkillTree } from "../../data/course-content";
import { XP_PER_LEVEL } from "../../data/course-content";

type UserProfileRow = RowDataPacket & {
  id: string;
  username: string;
  level: number;
  xp: number;
  created_at: string;
};

type LeaderboardRow = RowDataPacket & {
  id: string;
  username: string;
  level: number;
  xp: number;
  completed_levels: number;
};

type CountRow = RowDataPacket & { count: number };
type SumRow = RowDataPacket & { total: number };
type ActivityRow = RowDataPacket & {
  id: string;
  type: string;
  description: string;
  created_at: string;
  xp_earned: number | null;
};
type StreakRow = RowDataPacket & { day: string };
export async function getUserProfile(userId: string) {
  const [rows] = await pool.execute<UserProfileRow[]>(
    `SELECT id, username, level, xp, created_at FROM users WHERE id = ? LIMIT 1`,
    [userId],
  );
  const user = rows[0];
  if (!user) throw new AppError("User not found", 404);

  return {
    id: user.id,
    username: user.username,
    level: user.level,
    xp: user.xp,
    createdAt: user.created_at,
  };
}

export async function getProfileDetail(userId: string) {
  const user = await getUserProfile(userId);

  // 累计提交
  const [subRows] = await pool.execute<CountRow[]>(
    `SELECT COUNT(*) AS count FROM submissions WHERE user_id = ?`,
    [userId],
  );
  const totalSubmissions = subRows[0]?.count ?? 0;

  // 通关关卡数
  const [passRows] = await pool.execute<CountRow[]>(
    `SELECT COUNT(*) AS count FROM user_completed_levels WHERE user_id = ?`,
    [userId],
  );
  const passedLevels = passRows[0]?.count ?? 0;

  // 获得经验值
  const [xpRows] = await pool.execute<SumRow[]>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM xp_logs WHERE user_id = ?`,
    [userId],
  );
  const totalXpEarned = xpRows[0]?.total ?? 0;

  // 连续登录 / 最长连胜（基于提交日期去重）
  const [streakRows] = await pool.execute<StreakRow[]>(
    `SELECT DISTINCT DATE(submitted_at) AS day FROM submissions WHERE user_id = ? ORDER BY day DESC`,
    [userId],
  );
  const { currentStreak, longestStreak } = calcStreaks(
    streakRows.map((r) => r.day),
  );

  // 最近活动（最近 10 条提交记录）
  const [actRows] = await pool.execute<ActivityRow[]>(
    `SELECT
        s.id,
        CASE WHEN s.passed = 1 THEN 'level_completed' ELSE 'level_started' END AS type,
        COALESCE(l.title, '未知关卡') AS description,
        s.submitted_at AS created_at,
        s.earned_xp AS xp_earned
      FROM submissions s
      LEFT JOIN levels l ON l.id = s.level_id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC
      LIMIT 10`,
    [userId],
  );

  const recentActivity = actRows.map((r) => ({
    id: r.id,
    type: r.type as "level_completed" | "level_started",
    description:
      r.type === "level_completed"
        ? `通过「${r.description}」关卡`
        : `开始挑战「${r.description}」`,
    timestamp: r.created_at,
    xpEarned: r.xp_earned ?? undefined,
  }));

  // 成就派生
  const achievements = deriveAchievements(userId, passedLevels, totalSubmissions);

  // 下一级所需 XP
  const xpToNextLevel = (Math.floor(user.xp / XP_PER_LEVEL) + 1) * XP_PER_LEVEL;

  return {
    id: user.id,
    username: user.username,
    level: user.level,
    xp: user.xp,
    xpToNextLevel,
    title: deriveTitle(user.level),
    joinedAt: user.createdAt,
    stats: {
      totalSubmissions,
      passedLevels,
      totalXpEarned,
      currentStreak,
      longestStreak,
    },
    recentActivity,
    achievements,
  };
}

// ── Streak Calculation ──────────────────────────────

/** Format a Date as YYYY-MM-DD in local time. */
function toLocalDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Compare two YYYY-MM-DD date strings, checking if b is exactly one day before a.
 *  Uses local-date arithmetic to match MySQL DATE() which operates in the serverʼs
 *  local timezone. */
function isConsecutiveDay(a: string, b: string): boolean {
  const prev = new Date(a + "T00:00:00");
  const curr = new Date(b + "T00:00:00");
  const expected = new Date(prev);
  expected.setDate(expected.getDate() - 1);
  return toLocalDateString(expected) === toLocalDateString(curr);
}

function calcStreaks(days: string[]) {
  if (days.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const uniqueDays = [...new Set(days)].sort().reverse();
  let currentStreak = 0;
  let longestStreak = 1;
  let streak = 1;

  // Use local dates to stay consistent with MySQL DATE().
  const now = new Date();
  const today = toLocalDateString(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = toLocalDateString(yesterdayDate);

  if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      if (isConsecutiveDay(uniqueDays[i - 1], uniqueDays[i])) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // 计算最长连续
  for (let i = 1; i < uniqueDays.length; i++) {
    if (isConsecutiveDay(uniqueDays[i - 1], uniqueDays[i])) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 1;
    }
  }

  return { currentStreak, longestStreak };
}

// ── Achievement Derivation ──────────────────────────
function deriveAchievements(
  _userId: string,
  passedLevels: number,
  totalSubmissions: number,
) {
  const achievements: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string; // ISO timestamp — populated once we track unlock dates in the DB
  }[] = [
    {
      id: "ach-first",
      name: "代码新手",
      description: "完成第一个关卡",
      icon: "star",
      unlocked: passedLevels >= 1,
    },
    {
      id: "ach-submit-100",
      name: "百次提交",
      description: "累计提交 100 次",
      icon: "zap",
      unlocked: totalSubmissions >= 100,
    },
    {
      id: "ach-master",
      name: "学习大师",
      description: "通关 10 个以上关卡",
      icon: "trophy",
      unlocked: passedLevels >= 10,
    },
    {
      id: "ach-persist",
      name: "坚持不懈",
      description: "通关 20 个以上关卡",
      icon: "gem",
      unlocked: passedLevels >= 20,
    },
    {
      id: "ach-explorer",
      name: "探索者",
      description: "通关 30 个以上关卡",
      icon: "sword",
      unlocked: passedLevels >= 30,
    },
  ];

  return achievements;
}

// ── Leaderboard ─────────────────────────────────────
export async function getLeaderboard() {
  const [rows] = await pool.execute<LeaderboardRow[]>(
    `SELECT u.id, u.username, u.level, u.xp, COUNT(ucl.level_id) AS completed_levels
     FROM users u
     LEFT JOIN user_completed_levels ucl ON u.id = ucl.user_id
     GROUP BY u.id
     ORDER BY u.xp DESC, u.id ASC
     LIMIT 50`,
  );

  return rows.map((row, index) => ({
    rank: index + 1,
    userId: row.id,
    username: row.username,
    level: row.level,
    xp: row.xp,
    completedLevels: row.completed_levels,
    title: deriveTitle(row.level),
  }));
}

function deriveTitle(level: number): string {
  if (level >= 30) return "全栈大师";
  if (level >= 25) return "代码剑圣";
  if (level >= 20) return "算法王者";
  if (level >= 16) return "前端守护者";
  if (level >= 12) return "JS 操纵者";
  if (level >= 8) return "CSS 幻术师";
  if (level >= 5) return "代码冒险家";
  return "代码学徒";
}

// ── Skill Tree ────────────────────────────────────────
export async function getSkillTree(userId: string) {
  // 获取用户信息
  const user = await getUserProfile(userId);

  // 获取已通关关卡
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT level_id FROM user_completed_levels WHERE user_id = ?`,
    [userId],
  );
  const completedLevelIds = rows.map((r) => r.level_id as string);

  // 派生技能树
  const nodes = deriveSkillTree(completedLevelIds, user.level);
  return { nodes, userLevel: user.level };
}
