import { users } from "../../data/mock-db";
import { AppError } from "../../utils/app-error";

export function getUserProfile(userId: string) {
  const user = users.find((item) => item.id === userId);

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
