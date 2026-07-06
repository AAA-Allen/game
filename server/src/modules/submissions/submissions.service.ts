import { z } from "zod";

import {
  progressRecords,
  submissions,
  users,
} from "../../data/mock-db";
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

export function createSubmission(userId: string, input: unknown) {
  const payload = submissionSchema.parse(input);
  const level = getLevelById(payload.levelId);
  const user = users.find((item) => item.id === userId);
  const progress = progressRecords.find((item) => item.userId === userId);

  if (!user || !progress) {
    throw new AppError("User progress not found", 404);
  }

  const fullCode = `${payload.html}\n${payload.css}\n${payload.javascript}`;
  const matchedRules = level.requiredKeywords.filter((keyword) =>
    fullCode.includes(keyword),
  );
  const passed = matchedRules.length === level.requiredKeywords.length;
  const score = Math.round(
    (matchedRules.length / level.requiredKeywords.length) * 100,
  );
  const earnedXp = passed ? level.rewardXp : 0;

  if (passed && !progress.completedLevelIds.includes(level.id)) {
    progress.completedLevelIds.push(level.id);
    user.xp += earnedXp;
    user.level = calculateLevel(user.xp);
  }

  const submission = {
    id: `submission-${submissions.length + 1}`,
    userId,
    levelId: level.id,
    code: {
      html: payload.html,
      css: payload.css,
      javascript: payload.javascript,
    },
    passed,
    score,
    earnedXp,
    submittedAt: new Date().toISOString(),
  };

  submissions.push(submission);

  return {
    submission,
    progress: {
      level: user.level,
      xp: user.xp,
      completedLevelIds: progress.completedLevelIds,
    },
    feedback: passed
      ? "Challenge cleared"
      : "Missing required code fragments, keep trying",
  };
}
