import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import type { ApiResponse, AuthPayload, User } from "../../types/shared.js";

const authService = new AuthService();

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const payload = await authService.register(parsed.data);
    res
      .status(201)
      .json({ message: "Account created", data: payload } satisfies ApiResponse<AuthPayload>);
  } catch (err) {
    res.status(409).json({ message: (err as Error).message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const payload = await authService.login(parsed.data);
    res.json({ message: "Login successful", data: payload } satisfies ApiResponse<AuthPayload>);
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const userId = req.userId!;
  const user = await authService.getProfile(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" } satisfies ApiResponse);
    return;
  }
  res.json({ message: "Profile fetched", data: user } satisfies ApiResponse<User>);
}
