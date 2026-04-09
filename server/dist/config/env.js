"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("3000"),
    MONGODB_URI: zod_1.z.string().min(1, "MONGODB_URI is required"),
    JWT_KEY: zod_1.z.string().min(16, "JWT_KEY must be at least 16 characters"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    CLIENT_URL: zod_1.z.string().url().default("http://localhost:5173"),
    IMAGEKIT_PRIVATE_KEY: zod_1.z.string().optional(),
    OPENAI_KEY: zod_1.z.string().optional(),
    OPENAI_BASE_URL: zod_1.z.string().url().optional(),
    OPENAI_MODEL: zod_1.z.string().default("gemma-3-27b-it"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = {
    port: parseInt(parsed.data.PORT, 10),
    mongodbUri: parsed.data.MONGODB_URI,
    jwtKey: parsed.data.JWT_KEY,
    jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
    nodeEnv: parsed.data.NODE_ENV,
    clientUrl: parsed.data.CLIENT_URL,
    isDev: parsed.data.NODE_ENV === "development",
    imagekitPrivateKey: parsed.data.IMAGEKIT_PRIVATE_KEY,
    openaiKey: parsed.data.OPENAI_KEY,
    openaiBaseUrl: parsed.data.OPENAI_BASE_URL,
    openaiModel: parsed.data.OPENAI_MODEL,
};
//# sourceMappingURL=env.js.map