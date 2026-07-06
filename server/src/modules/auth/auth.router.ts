import { Router } from "express";

import { sendCreated, sendSuccess } from "../../utils/api-response";
import { login, register } from "./auth.service";

export const authRouter = Router();

authRouter.post("/register", (req, res) => {
  const result = register(req.body);
  return sendCreated(res, result, "register success");
});

authRouter.post("/login", (req, res) => {
  const result = login(req.body);
  return sendSuccess(res, result, "login success");
});
