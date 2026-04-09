import jwt from "jsonwebtoken";
import { UserModel } from "../user/user.schema.js";
import { env } from "../../config/env.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";
import type { User, AuthPayload } from "../../types/shared.js";

function signToken(userId: string): string {
  return jwt.sign({ userId }, env.jwtKey, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

// Accept unknown so the caller never needs a cast — we extract only what we need.
function toUser(doc: {
  _id: unknown;
  name: string;
  email: string;
  createdAt: unknown;
  updatedAt: unknown;
}): User {
  const toIso = (v: unknown): string => {
    if (v instanceof Date) return v.toISOString();
    return String(v ?? "");
  };
  return {
    _id:       String(doc._id),
    name:      doc.name,
    email:     doc.email,
    createdAt: toIso(doc.createdAt),
    updatedAt: toIso(doc.updatedAt),
  };
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthPayload> {
    const existing = await UserModel.findOne({ email: input.email });
    if (existing) throw new Error("Email already in use");

    const doc   = await UserModel.create(input);
    const token = signToken(String(doc._id));
    return { token, user: toUser(doc) };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const doc = await UserModel.findOne({ email: input.email }).select("+password");
    if (!doc) throw new Error("Invalid email or password");

    const valid = await doc.comparePassword(input.password);
    if (!valid) throw new Error("Invalid email or password");

    const token = signToken(String(doc._id));
    return { token, user: toUser(doc) };
  }

  async getProfile(userId: string): Promise<User | null> {
    const doc = await UserModel.findById(userId).lean();
    if (!doc) return null;
    // lean() returns a plain object — cast through unknown to satisfy toUser
    return toUser(doc as unknown as Parameters<typeof toUser>[0]);
  }
}
