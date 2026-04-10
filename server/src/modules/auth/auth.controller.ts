import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import type { ApiResponse, AuthPayload, User } from "../../types/shared.js";

const authService = new AuthService();

// Validation helper — keeps controllers free of repeated safeParse boilerplate
function validateBody<T>(
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

// asyncHandler forwards thrown errors to errorHandler — no try/catch needed here
export async function register(req: Request, res: Response): Promise<void> {
  const input = validateBody(registerSchema, req.body, res);
  if (!input) return;

  const payload = await authService.register(input);
  res.status(201).json({ message: "Account created", data: payload } satisfies ApiResponse<AuthPayload>);
}

export async function login(req: Request, res: Response): Promise<void> {
  const input = validateBody(loginSchema, req.body, res);
  if (!input) return;

  const payload = await authService.login(input);
  res.json({ message: "Login successful", data: payload } satisfies ApiResponse<AuthPayload>);
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await authService.getProfile(req.userId!);
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  res.json({ message: "Profile fetched", data: user } satisfies ApiResponse<User>);
}
