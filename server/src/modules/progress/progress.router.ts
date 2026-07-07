import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { sendSuccess } from "../../utils/api-response";
import { getCurrentProgress } from "./progress.service";

export const progressRouter = Router();

progressRouter.get("/current", requireAuth, async (req, res) => {
  const progress = await getCurrentProgress(req.user!.userId);
  return sendSuccess(res, progress);
});
