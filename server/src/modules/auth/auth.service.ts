import jwt from "jsonwebtoken";
import { UserModel } from "../user/user.schema.js";
import { env } from "../../config/env.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";
import type { User, AuthPayload } from "../../types/shared.js";

// Typed error so errorHandler maps it to the correct HTTP status
class HttpError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "HttpError";
  }
}

function signToken(userId: string): string {
  return jwt.sign({ userId }, env.jwtKey, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

function toUser(doc: {
  _id: unknown;
  name: string;
  email: string;
  createdAt: unknown;
  updatedAt: unknown;
}): User {
  const toIso = (v: unknown): string =>
    v instanceof Date ? v.toISOString() : String(v ?? "");
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
    if (existing) throw new HttpError("Email already in use", 409);

    const doc   = await UserModel.create(input);
    const token = signToken(String(doc._id));
    return { token, user: toUser(doc) };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const doc = await UserModel.findOne({ email: input.email }).select("+password");
    // Identical message for both cases — prevents user enumeration
    if (!doc) throw new HttpError("Invalid email or password", 401);

    const valid = await doc.comparePassword(input.password);
    if (!valid) throw new HttpError("Invalid email or password", 401);

    const token = signToken(String(doc._id));
    return { token, user: toUser(doc) };
  }

  async getProfile(userId: string): Promise<User | null> {
    const doc = await UserModel.findById(userId).lean();
    if (!doc) return null;
    return toUser(doc as unknown as Parameters<typeof toUser>[0]);
  }
}
