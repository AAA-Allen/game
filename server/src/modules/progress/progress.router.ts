import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/api-response";
import { getCurrentProgress } from "./progress.service";

export const progressRouter = Router();

progressRouter.get(
  "/current",
  requireAuth,
  asyncHandler(async (req, res) => {
    const progress = await getCurrentProgress(req.user!.userId);
    return sendSuccess(res, progress);
  }),
);
