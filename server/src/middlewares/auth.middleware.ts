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

  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, env.jwtSecret, {
      algorithms: ["HS256"],
    }) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token", 401));
    }
    return next(new AppError("Invalid token", 401));
  }

  // DB query is outside the JWT try-catch so database errors
  // propagate as 500 instead of being masked as "Invalid token".
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
}
