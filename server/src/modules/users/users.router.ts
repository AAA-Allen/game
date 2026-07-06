import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { sendSuccess } from "../../utils/api-response";
import { getUserProfile } from "./users.service";

export const usersRouter = Router();

usersRouter.get("/profile", requireAuth, async (req, res) => {
  const profile = await getUserProfile(req.user!.userId);
  return sendSuccess(res, profile);
});
