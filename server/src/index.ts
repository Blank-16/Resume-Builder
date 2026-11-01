import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { resumeRouter } from "./modules/resume/resume.route.js";
import { aiRouter } from "./modules/ai/ai.route.js";
import { userRouter } from "./modules/user/user.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

/* ── Security headers ── */
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (!env.isDev) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
  next();
});

/* ── CORS ── */
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (origin === env.clientUrl) return cb(null, true);
      if (
        env.isDev &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return cb(null, true);
      }
      const err = new Error(
        `CORS: origin '${origin}' is not allowed`,
      ) as Error & { statusCode: number };
      err.statusCode = 403;
      cb(err);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);
app.use("/api", apiLimiter);

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const segments: string[] = [];
  if (d > 0) segments.push(`${d}d`);
  if (h > 0) segments.push(`${h}h`);
  if (m > 0) segments.push(`${m}m`);
  segments.push(`${s}s`);
  return segments.join(" ");
}

/* ── Routes ── */
app.get("/", (req: Request, res: Response): void => {
  const acceptsHtml =
    req.accepts("html") && req.headers.accept?.includes("text/html");
  const isDbConnected = mongoose.connection.readyState === 1;
  const dbStatus = isDbConnected ? "connected" : "disconnected";
  const uptimeSeconds = Math.floor(process.uptime());
  const timestamp = new Date().toISOString();

  if (!acceptsHtml) {
    res.json({
      status: "ok",
      service: "resume-builder-api",
      env: env.nodeEnv,
      database: dbStatus,
      uptime: uptimeSeconds,
      timestamp,
      routes: {
        health: "/health",
        auth: "/api/auth",
        resumes: "/api/resumes",
        ai: "/api/ai",
        users: "/api/users",
      },
    });
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Builder API Gateway</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --border: #1f2937;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --accent: #10b981;
      --accent-bg: rgba(16, 185, 129, 0.1);
      --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text-main);
      font-family: var(--font);
      padding: 2.5rem 1rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 100%;
      max-width: 680px;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .header {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }
    .subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      background: var(--accent-bg);
      color: var(--accent);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      border: 1px solid rgba(16, 185, 129, 0.25);
    }
    .dot {
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .card-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .card-val {
      font-size: 0.95rem;
      font-weight: 600;
      font-family: var(--mono);
      color: var(--text-main);
    }
    .card-val.status-good {
      color: var(--accent);
    }
    .card-val.status-bad {
      color: #ef4444;
    }
    .section-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .routes {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .route-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.02);
      font-size: 0.85rem;
    }
    .route-path {
      font-family: var(--mono);
      color: #60a5fa;
      text-decoration: none;
    }
    .route-path:hover {
      text-decoration: underline;
    }
    .route-desc {
      color: var(--text-muted);
      font-size: 0.8rem;
    }
    .method-tag {
      font-size: 0.7rem;
      font-weight: 700;
      font-family: var(--mono);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: rgba(96, 165, 250, 0.15);
      color: #93c5fd;
      margin-right: 0.5rem;
    }
    .footer {
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }
    .footer a {
      color: #60a5fa;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <main class="container">
    <div class="header">
      <div class="title-group">
        <h1 class="title">Resume Builder API Gateway</h1>
        <p class="subtitle">Backend Services and Health Monitor</p>
      </div>
      <div class="badge">
        <span class="dot"></span>
        <span>Operational</span>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <span class="card-label">HTTP Status</span>
        <span class="card-val status-good">200 OK</span>
      </div>
      <div class="card">
        <span class="card-label">Environment</span>
        <span class="card-val">${env.nodeEnv}</span>
      </div>
      <div class="card">
        <span class="card-label">Database</span>
        <span class="card-val ${isDbConnected ? "status-good" : "status-bad"}">${dbStatus}</span>
      </div>
      <div class="card">
        <span class="card-label">Uptime</span>
        <span class="card-val">${formatUptime(uptimeSeconds)}</span>
      </div>
    </div>

    <div>
      <h2 class="section-title">Gateway Endpoints</h2>
      <div class="routes">
        <div class="route-item">
          <div>
            <span class="method-tag">GET</span>
            <a class="route-path" href="/health">/health</a>
          </div>
          <span class="route-desc">JSON health probe</span>
        </div>
        <div class="route-item">
          <div>
            <span class="method-tag">API</span>
            <span class="route-path">/api/auth</span>
          </div>
          <span class="route-desc">Authentication and tokens</span>
        </div>
        <div class="route-item">
          <div>
            <span class="method-tag">API</span>
            <span class="route-path">/api/resumes</span>
          </div>
          <span class="route-desc">Resume management</span>
        </div>
        <div class="route-item">
          <div>
            <span class="method-tag">API</span>
            <span class="route-path">/api/ai</span>
          </div>
          <span class="route-desc">AI writing suggestions</span>
        </div>
        <div class="route-item">
          <div>
            <span class="method-tag">API</span>
            <span class="route-path">/api/users</span>
          </div>
          <span class="route-desc">User profiles</span>
        </div>
      </div>
    </div>

    <footer class="footer">
      <span>Connected client: <a href="${env.clientUrl}" target="_blank" rel="noreferrer">${env.clientUrl}</a></span>
    </footer>
  </main>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: env.nodeEnv });
});

app.use("/api/auth", authRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);
app.use("/api/users", userRouter);

/* ── Global error handler (must be last) ── */
app.use(errorHandler);

async function main(): Promise<void> {
  await connectDB();
  app.listen(env.port, () => {
    console.log(
      `Server running → http://localhost:${env.port}  [${env.nodeEnv}]`,
    );
  });
}

main().catch(console.error);
