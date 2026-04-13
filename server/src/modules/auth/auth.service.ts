import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../user/user.schema.js";
import { env } from "../../config/env.js";
import type { RegisterInput, LoginInput, RefreshInput } from "./auth.validation.js";
import type { User, AuthPayload } from "../../types/shared.js";

class HttpError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "HttpError";
  }
}

// Short-lived access token (15 min)
function signAccessToken(userId: string): string {
  return jwt.sign({ userId, type: "access" }, env.jwtKey, { expiresIn: "15m" });
}

// Long-lived refresh token — 7 days (rememberMe) or 24 hours
function signRefreshToken(userId: string, rememberMe: boolean): string {
  return jwt.sign(
    { userId, type: "refresh" },
    env.jwtKey,
    { expiresIn: rememberMe ? "7d" : "24h" }
  );
}

function toUser(doc: {
  _id: unknown; name: string; email: string;
  createdAt: unknown; updatedAt: unknown;
}): User {
  const toIso = (v: unknown) => v instanceof Date ? v.toISOString() : String(v ?? "");
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

    const doc          = await UserModel.create({ name: input.name, email: input.email, password: input.password });
    const accessToken  = signAccessToken(String(doc._id));
    const refreshToken = signRefreshToken(String(doc._id), input.rememberMe ?? false);

    // Store hashed refresh token
    const hashed = await bcrypt.hash(refreshToken, 8);
    await UserModel.findByIdAndUpdate(doc._id, { $push: { refreshTokens: hashed } });

    return { token: accessToken, refreshToken, user: toUser(doc) };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const doc = await UserModel.findOne({ email: input.email }).select("+password +refreshTokens");
    if (!doc) throw new HttpError("Invalid email or password", 401);

    const valid = await doc.comparePassword(input.password);
    if (!valid) throw new HttpError("Invalid email or password", 401);

    const accessToken  = signAccessToken(String(doc._id));
    const refreshToken = signRefreshToken(String(doc._id), input.rememberMe ?? false);

    // Keep at most 5 refresh tokens (5 devices). Drop oldest when full.
    const existing = (doc.refreshTokens ?? []).slice(-4);
    const hashed   = await bcrypt.hash(refreshToken, 8);
    await UserModel.findByIdAndUpdate(doc._id, {
      $set: { refreshTokens: [...existing, hashed] },
    });

    return { token: accessToken, refreshToken, user: toUser(doc) };
  }

  async refresh(input: RefreshInput): Promise<Pick<AuthPayload, "token">> {
    let payload: { userId: string; type: string };
    try {
      payload = jwt.verify(input.refreshToken, env.jwtKey) as typeof payload;
    } catch {
      throw new HttpError("Invalid or expired refresh token", 401);
    }

    if (payload.type !== "refresh") throw new HttpError("Invalid token type", 401);

    // Find user and verify the refresh token is in their list
    const doc = await UserModel.findById(payload.userId).select("+refreshTokens");
    if (!doc) throw new HttpError("User not found", 401);

    let matched = false;
    for (const stored of doc.refreshTokens ?? []) {
      if (await bcrypt.compare(input.refreshToken, stored)) {
        matched = true;
        break;
      }
    }
    if (!matched) throw new HttpError("Refresh token revoked", 401);

    return { token: signAccessToken(payload.userId) };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const doc = await UserModel.findById(userId).select("+refreshTokens");
    if (!doc) return;

    // Remove the specific refresh token that's being logged out
    const remaining: string[] = [];
    for (const stored of doc.refreshTokens ?? []) {
      if (!(await bcrypt.compare(refreshToken, stored))) {
        remaining.push(stored);
      }
    }
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshTokens: remaining } });
  }

  async logoutAll(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
  }

  async getProfile(userId: string): Promise<User | null> {
    const doc = await UserModel.findById(userId).lean();
    if (!doc) return null;
    return toUser(doc as unknown as Parameters<typeof toUser>[0]);
  }
}
