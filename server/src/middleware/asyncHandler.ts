import type { Request, Response, NextFunction, RequestHandler } from "express";

// Wraps an async route handler so any thrown error is forwarded to
// Express's error handler via next(err) instead of being silently swallowed.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
