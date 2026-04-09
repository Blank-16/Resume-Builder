"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const env_js_1 = require("../config/env.js");
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode ?? 500;
    const message = statusCode === 500 && !env_js_1.env.isDev ? "Internal server error" : err.message;
    if (env_js_1.env.isDev) {
        console.error(`[Error] ${err.stack}`);
    }
    res.status(statusCode).json({ message });
}
//# sourceMappingURL=errorHandler.js.map