import { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/app-error";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    error instanceof AppError ? error.message : "Internal server error";

  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: null,
  });
}
