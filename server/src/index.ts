import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { resumeRouter } from "./modules/resume/resume.route.js";
import { aiRouter } from "./modules/ai/ai.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

/* ── Security headers ── */
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options",  "nosniff");
  res.setHeader("X-Frame-Options",         "DENY");
  res.setHeader("X-XSS-Protection",        "1; mode=block");
  res.setHeader("Referrer-Policy",         "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy",      "camera=(), microphone=(), geolocation=()");
  if (!env.isDev) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

/* ── CORS ── */
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (origin === env.clientUrl) return cb(null, true);
      const err = new Error(`CORS: origin '${origin}' is not allowed`) as Error & { statusCode: number };
      err.statusCode = 403;
      cb(err);
    },
    credentials: true,
    methods:     ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);
app.use("/api", apiLimiter);

/* ── Routes ── */
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: env.nodeEnv });
});

app.use("/api/auth",    authRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai",      aiRouter);

/* ── Global error handler (must be last) ── */
app.use(errorHandler);

async function main(): Promise<void> {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running → http://localhost:${env.port}  [${env.nodeEnv}]`);
  });
}

main().catch(console.error);
