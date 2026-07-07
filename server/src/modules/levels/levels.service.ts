import { levels } from "../../data/course-content";
import { AppError } from "../../utils/app-error";

export function getLevels(zoneId?: string) {
  if (!zoneId) {
    return [...levels].sort((left, right) => left.sortOrder - right.sortOrder);
  }

  return levels
    .filter((level) => level.zoneId === zoneId)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function getLevelById(levelId: string) {
  const level = levels.find((item) => item.id === levelId);

  if (!level) {
    throw new AppError("Level not found", 404);
  }

  return level;
}
