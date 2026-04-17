import type { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AppError extends Error {
  statusCode?: number;
}

// Map known error types to appropriate HTTP status codes so controllers
// can throw plain errors and this handler classifies them correctly.
function resolveStatus(err: AppError): number {
  if (err.statusCode) return err.statusCode;

  // Mongoose validation error (required field missing, enum invalid, etc.)
  if (err instanceof MongooseError.ValidationError) return 422;

  // Mongoose cast error (e.g. invalid ObjectId format that slipped through)
  if (err instanceof MongooseError.CastError) return 400;

  // JWT errors
  if (err instanceof TokenExpiredError) return 401;
  if (err instanceof JsonWebTokenError) return 401;

  // Duplicate key (e.g. unique email constraint)
  if ((err as { code?: number }).code === 11000) return 409;

  return 500;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  // _next must be declared even if unused — Express uses arity to identify error handlers
  _next: NextFunction
): void {
  const statusCode = resolveStatus(err);

  // Never leak internal stack traces in production
  const message =
    statusCode === 500 && !env.isDev ? "Internal server error" : err.message;

  if (env.isDev) {
    console.error(`[${statusCode}] ${err.stack ?? err.message}`);
  } else if (statusCode === 500) {
    // Log 500s in production too, without exposing them to the client
    console.error(`[500] ${err.message}`);
  }

  if (res.headersSent) return;
  res.status(statusCode).json({ message });
}
