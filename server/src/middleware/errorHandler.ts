import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = statusCode === 500 && !env.isDev ? "Internal server error" : err.message;

  if (env.isDev) {
    console.error(`[Error] ${err.stack}`);
  }

  res.status(statusCode).json({ message });
}
