import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_KEY: z.string().min(16, "JWT_KEY must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  OPENAI_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().default("gemma-3-27b-it"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
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
} as const;
