"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_js_1 = require("../user/user.schema.js");
const env_js_1 = require("../../config/env.js");
function signToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, env_js_1.env.jwtKey, {
        expiresIn: env_js_1.env.jwtExpiresIn,
    });
}
// Accept unknown so the caller never needs a cast — we extract only what we need.
function toUser(doc) {
    const toIso = (v) => {
        if (v instanceof Date)
            return v.toISOString();
        return String(v ?? "");
    };
    return {
        _id: String(doc._id),
        name: doc.name,
        email: doc.email,
        createdAt: toIso(doc.createdAt),
        updatedAt: toIso(doc.updatedAt),
    };
}
class AuthService {
    async register(input) {
        const existing = await user_schema_js_1.UserModel.findOne({ email: input.email });
        if (existing)
            throw new Error("Email already in use");
        const doc = await user_schema_js_1.UserModel.create(input);
        const token = signToken(String(doc._id));
        return { token, user: toUser(doc) };
    }
    async login(input) {
        const doc = await user_schema_js_1.UserModel.findOne({ email: input.email }).select("+password");
        if (!doc)
            throw new Error("Invalid email or password");
        const valid = await doc.comparePassword(input.password);
        if (!valid)
            throw new Error("Invalid email or password");
        const token = signToken(String(doc._id));
        return { token, user: toUser(doc) };
    }
    async getProfile(userId) {
        const doc = await user_schema_js_1.UserModel.findById(userId).lean();
        if (!doc)
            return null;
        // lean() returns a plain object — cast through unknown to satisfy toUser
        return toUser(doc);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map