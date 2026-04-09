import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!env.isDev) return next();

  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const color =
      res.statusCode >= 500
        ? "\x1b[31m"
        : res.statusCode >= 400
          ? "\x1b[33m"
          : "\x1b[32m";
    console.log(
      `${color}${req.method}\x1b[0m ${req.path} ${res.statusCode} ${duration}ms`
    );
  });
  next();
}
