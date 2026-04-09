"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_js_1.env.jwtKey);
        req.userId = decoded.userId;
        next();
    }
    catch {
        res.status(401).json({ message: "Unauthorized" });
    }
}
//# sourceMappingURL=authenticate.js.map