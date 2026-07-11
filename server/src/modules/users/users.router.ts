import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/api-response";
import { getLeaderboard, getProfileDetail, getSkillTree, getUserProfile } from "./users.service";

export const usersRouter = Router();

usersRouter.get(
  "/profile",
  requireAuth,
  asyncHandler(async (req, res) => {
    const profile = await getUserProfile(req.user!.userId);
    return sendSuccess(res, profile);
  }),
);

usersRouter.get(
  "/profile/detail",
  requireAuth,
  asyncHandler(async (req, res) => {
    const detail = await getProfileDetail(req.user!.userId);
    return sendSuccess(res, detail);
  }),
);

usersRouter.get(
  "/leaderboard",
  asyncHandler(async (_req, res) => {
    const entries = await getLeaderboard();
    return sendSuccess(res, entries);
  }),
);

usersRouter.get(
  "/skill-tree",
  requireAuth,
  asyncHandler(async (req, res) => {
    const tree = await getSkillTree(req.user!.userId);
    return sendSuccess(res, tree);
  }),
);
