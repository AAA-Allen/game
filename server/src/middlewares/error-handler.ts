import { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/app-error";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const maybeZodError = error as {
    issues?: Array<{ path: Array<string | number>; message: string }>;
  };

  if (Array.isArray(maybeZodError.issues)) {

    return res.status(400).json({
      code: 400,
      message: "Validation failed",
      data: {
        issues: maybeZodError.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    error instanceof AppError ? error.message : "Internal server error";

  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: null,
  });
}
