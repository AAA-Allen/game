import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { users } from "../data/mock-db";
import { AppError } from "../utils/app-error";

type TokenPayload = {
  userId: string;
  username: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    const user = users.find((item) => item.id === payload.userId);

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = payload;
    return next();
  } catch {
    return next(new AppError("Invalid token", 401));
  }
}
