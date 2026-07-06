import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { sendSuccess } from "../../utils/api-response";
import { getCurrentProgress } from "./progress.service";

export const progressRouter = Router();

progressRouter.get("/current", requireAuth, (req, res) => {
  return sendSuccess(res, getCurrentProgress(req.user!.userId));
});
