import { Router } from "express";

import { sendCreated, sendSuccess } from "../../utils/api-response";
import { login, register } from "./auth.service";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const result = await register(req.body);
  return sendCreated(res, result, "register success");
});

authRouter.post("/login", async (req, res) => {
  const result = await login(req.body);
  return sendSuccess(res, result, "login success");
});
