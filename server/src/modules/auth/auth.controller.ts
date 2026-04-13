import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { registerSchema, loginSchema, refreshSchema } from "./auth.validation.js";
import type { ApiResponse, AuthPayload, User } from "../../types/shared.js";

const authService = new AuthService();

function validate<T>(
  schema: { safeParse: (v: unknown) => { success: true; data: T } | { success: false; error: { flatten: () => { fieldErrors: Record<string, string[]> } } } },
  body: unknown,
  res: Response
): T | null {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
    return null;
  }
  return parsed.data;
}

export async function register(req: Request, res: Response): Promise<void> {
  const input = validate(registerSchema, req.body, res);
  if (!input) return;
  const payload = await authService.register(input);
  res.status(201).json({ message: "Account created", data: payload } satisfies ApiResponse<AuthPayload>);
}

export async function login(req: Request, res: Response): Promise<void> {
  const input = validate(loginSchema, req.body, res);
  if (!input) return;
  const payload = await authService.login(input);
  res.json({ message: "Login successful", data: payload } satisfies ApiResponse<AuthPayload>);
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const input = validate(refreshSchema, req.body, res);
  if (!input) return;
  const result = await authService.refresh(input);
  res.json({ message: "Token refreshed", data: result } satisfies ApiResponse<Pick<AuthPayload, "token">>);
}

export async function logoutHandler(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken && req.userId) {
    await authService.logout(req.userId, refreshToken);
  }
  res.json({ message: "Logged out" } satisfies ApiResponse);
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await authService.getProfile(req.userId!);
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  res.json({ message: "Profile fetched", data: user } satisfies ApiResponse<User>);
}
