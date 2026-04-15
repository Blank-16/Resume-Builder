import type { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { UserModel } from "./user.schema.js";
import type { ApiResponse, User } from "../../types/shared.js";

const updateProfileSchema = z.object({
  name:  z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8, "New password must be at least 8 characters"),
});

function toUser(doc: { _id: unknown; name: string; email: string; createdAt: unknown; updatedAt: unknown }): User {
  const toIso = (v: unknown) => v instanceof Date ? v.toISOString() : String(v ?? "");
  return { _id: String(doc._id), name: doc.name, email: doc.email, createdAt: toIso(doc.createdAt), updatedAt: toIso(doc.updatedAt) };
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const { name, email } = parsed.data;
  if (!name && !email) { res.status(400).json({ message: "Nothing to update" }); return; }

  // Check email not already taken by another user
  if (email) {
    const existing = await UserModel.findOne({ email, _id: { $ne: req.userId } });
    if (existing) { res.status(409).json({ message: "Email already in use" }); return; }
  }

  const doc = await UserModel.findByIdAndUpdate(
    req.userId,
    { $set: { ...(name && { name }), ...(email && { email }) } },
    { new: true }
  ).lean();

  if (!doc) { res.status(404).json({ message: "User not found" }); return; }
  res.json({ message: "Profile updated", data: toUser(doc as unknown as Parameters<typeof toUser>[0]) } satisfies ApiResponse<User>);
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const doc = await UserModel.findById(req.userId).select("+password");
  if (!doc) { res.status(404).json({ message: "User not found" }); return; }

  const valid = await doc.comparePassword(parsed.data.currentPassword);
  if (!valid) { res.status(401).json({ message: "Current password is incorrect" }); return; }

  doc.password = parsed.data.newPassword;
  await doc.save(); // triggers pre-save hash
  res.json({ message: "Password changed successfully" } satisfies ApiResponse);
}

export async function deleteAccount(req: Request, res: Response): Promise<void> {
  const { password } = req.body as { password?: string };
  if (!password) { res.status(400).json({ message: "Password required to delete account" }); return; }

  const doc = await UserModel.findById(req.userId).select("+password");
  if (!doc) { res.status(404).json({ message: "User not found" }); return; }

  const valid = await doc.comparePassword(password);
  if (!valid) { res.status(401).json({ message: "Incorrect password" }); return; }

  // Delete user and all their resumes in parallel
  const { ResumeModel } = await import("../resume/resume.schema.js");
  await Promise.all([
    UserModel.findByIdAndDelete(req.userId),
    ResumeModel.deleteMany({ userId: req.userId }),
  ]);

  res.json({ message: "Account deleted" } satisfies ApiResponse);
}
