import { progressRecords, users } from "../../data/mock-db";
import { AppError } from "../../utils/app-error";

export function getCurrentProgress(userId: string) {
  const progress = progressRecords.find((item) => item.userId === userId);
  const user = users.find((item) => item.id === userId);

  if (!progress || !user) {
    throw new AppError("Progress not found", 404);
  }

  return {
    userId,
    currentLevel: user.level,
    currentXp: user.xp,
    currentLevelId: progress.currentLevelId,
    completedLevelIds: progress.completedLevelIds,
    unlockedZoneIds: progress.unlockedZoneIds,
  };
}
