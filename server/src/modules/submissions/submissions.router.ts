import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { sendCreated } from "../../utils/api-response";
import { createSubmission } from "./submissions.service";

export const submissionsRouter = Router();

submissionsRouter.post("/", requireAuth, (req, res) => {
  const result = createSubmission(req.user!.userId, req.body);
  return sendCreated(res, result, "submission created");
});
