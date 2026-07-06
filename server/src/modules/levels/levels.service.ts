import { levels } from "../../data/mock-db";
import { AppError } from "../../utils/app-error";

export function getLevels(zoneId?: string) {
  if (!zoneId) {
    return levels;
  }

  return levels.filter((level) => level.zoneId === zoneId);
}

export function getLevelById(levelId: string) {
  const level = levels.find((item) => item.id === levelId);

  if (!level) {
    throw new AppError("Level not found", 404);
  }

  return level;
}
