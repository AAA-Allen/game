import { Router } from "express";

import { asyncHandler } from "../../utils/async-handler";
import { sendCreated, sendSuccess } from "../../utils/api-response";
import { login, register } from "./auth.service";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const result = await register(req.body);
    return sendCreated(res, result, "register success");
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const result = await login(req.body);
    return sendSuccess(res, result, "login success");
  }),
);
