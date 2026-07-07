export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type AuthUser = {
  id: string;
  username: string;
  level: number;
  xp: number;
};

export type Zone = {
  id: string;
  name: string;
  slug: string;
  description: string;
  requiredLevel: number;
  isUnlocked?: boolean;
};

export type Level = {
  id: string;
  zoneId: string;
  chapter: string;
  sortOrder: number;
  title: string;
  subtitle: string;
  story: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  rewardXp: number;
  learningObjectives: string[];
  prerequisites: string[];
  knowledgePoints: string[];
  taskDescription: string[];
  passCriteria: string[];
  hintLevels: string[];
  starterCode: {
    html: string;
    css: string;
    javascript: string;
  };
  validationRules: Array<{
    id: string;
    description: string;
    keywords: string[];
  }>;
  requiredKeywords: string[];
};

export type ProgressData = {
  userId: string;
  currentLevel: number;
  currentXp: number;
  currentLevelId: string;
  completedLevelIds: string[];
  unlockedZoneIds: string[];
};

export type SubmissionResult = {
  submission: {
    id: string;
    userId: string;
    levelId: string;
    passed: boolean;
    score: number;
    earnedXp: number;
    submittedAt: string;
  };
  progress: {
    level: number;
    xp: number;
    completedLevelIds: string[];
  };
  feedback: string;
};

// ── User Profile ──────────────────────────────────
export type ProfileStats = {
  totalSubmissions: number;
  passedLevels: number;
  totalXpEarned: number;
  currentStreak: number;
  longestStreak: number;
};

export type ActivityEntry = {
  id: string;
  type: "level_completed" | "level_started" | "achievement_unlocked";
  description: string;
  timestamp: string;
  xpEarned?: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
};

export type UserProfile = {
  id: string;
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
  joinedAt: string;
  stats: ProfileStats;
  recentActivity: ActivityEntry[];
  achievements: Achievement[];
};

// ── Skill Tree ────────────────────────────────────
export type SkillNode = {
  id: string;
  name: string;
  description: string;
  category: string;
  x: number;
  y: number;
  requiredLevel: number;
  requiredNodeIds: string[];
  isUnlocked: boolean;
  maxLevel: number;
  currentLevel: number;
  effects: string[];
};

export type SkillCategory = {
  id: string;
  name: string;
  color: string;
  nodes: SkillNode[];
};

// ── Leaderboard ───────────────────────────────────
export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  level: number;
  xp: number;
  title: string;
  completedLevels: number;
};

export type LeaderboardData = {
  entries: LeaderboardEntry[];
  currentUserRank: number;
  totalPlayers: number;
};
