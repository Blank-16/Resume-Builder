"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const env_js_1 = require("../config/env.js");
function requestLogger(req, res, next) {
    if (!env_js_1.env.isDev)
        return next();
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const color = res.statusCode >= 500
            ? "\x1b[31m"
            : res.statusCode >= 400
                ? "\x1b[33m"
                : "\x1b[32m";
        console.log(`${color}${req.method}\x1b[0m ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
}
//# sourceMappingURL=requestLogger.js.map