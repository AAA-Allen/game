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
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  rewardXp: number;
  starterCode: {
    html: string;
    css: string;
    javascript: string;
  };
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
