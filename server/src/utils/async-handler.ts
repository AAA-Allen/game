import { NextFunction, Request, Response } from "express";

/**
 * Wraps an async Express route handler so that rejected promises
 * are forwarded to Express error-handling middleware via next().
 *
 * Express 4 does not catch promise rejections from async route handlers,
 * which causes requests to hang on unhandled errors.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
