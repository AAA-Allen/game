import { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, message = "success") {
  return res.status(200).json({
    code: 0,
    message,
    data,
  });
}

export function sendCreated<T>(res: Response, data: T, message = "created") {
  return res.status(201).json({
    code: 0,
    message,
    data,
  });
}
