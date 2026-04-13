import { rateLimit } from "express-rate-limit";

// Shared options for JSON-formatted rate limit responses
const jsonFormat = {
  standardHeaders: "draft-7" as const,
  legacyHeaders:   false,
};

// General API limiter — applied to all /api/* routes
// 200 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  ...jsonFormat,
  windowMs: 15 * 60 * 1000,
  max:      200,
  message:  { message: "Too many requests, please slow down." },
});

// Auth: login — 10 attempts per 15 minutes per IP
// skipSuccessfulRequests: only failed logins count against the limit
export const loginLimiter = rateLimit({
  ...jsonFormat,
  windowMs:              15 * 60 * 1000,
  max:                   10,
  skipSuccessfulRequests:true,
  message: { message: "Too many login attempts. Please wait 15 minutes." },
});

// Auth: register — 5 accounts per hour per IP
export const registerLimiter = rateLimit({
  ...jsonFormat,
  windowMs: 60 * 60 * 1000,
  max:      5,
  message:  { message: "Too many registrations from this IP. Please try later." },
});

// Auth: refresh — 30 refreshes per 15 minutes per IP
// Prevents refresh token abuse; normal use is ~1 per 13 minutes
export const refreshLimiter = rateLimit({
  ...jsonFormat,
  windowMs: 15 * 60 * 1000,
  max:      30,
  message:  { message: "Too many token refresh attempts. Please try later." },
});

// AI suggestions — 20 per minute per IP (expensive endpoint)
export const aiLimiter = rateLimit({
  ...jsonFormat,
  windowMs: 60 * 1000,
  max:      20,
  message:  { message: "AI rate limit reached, please wait a moment." },
});
