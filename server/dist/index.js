"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_js_1 = require("./config/env.js");
const db_js_1 = require("./config/db.js");
const auth_route_js_1 = require("./modules/auth/auth.route.js");
const resume_route_js_1 = require("./modules/resume/resume.route.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const requestLogger_js_1 = require("./middleware/requestLogger.js");
const app = (0, express_1.default)();
/* ── Security headers ── */
app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (!env_js_1.env.isDev) {
        // Only send HSTS in production — localhost does not support HTTPS
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
});
/* ── CORS — allow only the configured client origin ── */
app.use((0, cors_1.default)({
    origin(origin, cb) {
        // Allow server-to-server / curl requests (no origin header)
        if (!origin)
            return cb(null, true);
        if (origin === env_js_1.env.clientUrl)
            return cb(null, true);
        // Return a proper error message; errorHandler converts this to JSON
        const err = new Error(`CORS: origin '${origin}' is not allowed`);
        err.statusCode = 403;
        cb(err);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json({ limit: "1mb" }));
app.use(requestLogger_js_1.requestLogger);
/* ── Routes ── */
app.get("/health", (_req, res) => {
    res.json({ status: "ok", env: env_js_1.env.nodeEnv });
});
app.use("/api/auth", auth_route_js_1.authRouter);
app.use("/api/resumes", resume_route_js_1.resumeRouter);
/* ── Global error handler (must be last) ── */
app.use(errorHandler_js_1.errorHandler);
async function main() {
    await (0, db_js_1.connectDB)();
    app.listen(env_js_1.env.port, () => {
        console.log(`Server running → http://localhost:${env_js_1.env.port}  [${env_js_1.env.nodeEnv}]`);
    });
}
main().catch(console.error);
//# sourceMappingURL=index.js.map