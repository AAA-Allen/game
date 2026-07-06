import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { RowDataPacket } from "mysql2/promise";

import { pool } from "../config/db";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";

type TokenPayload = {
  userId: string;
  username: string;
};

type AuthUserRow = RowDataPacket & {
  id: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export async function requireAuth(
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
    const [rows] = await pool.execute<AuthUserRow[]>(
      `
        SELECT id
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [payload.userId],
    );
    const user = rows[0];

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = payload;
    return next();
  } catch {
    return next(new AppError("Invalid token", 401));
  }
}
