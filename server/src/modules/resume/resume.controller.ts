import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { ResumeService } from "./resume.service.js";
import { createResumeSchema, updateResumeSchema } from "./resume.validation.js";
import type { ApiResponse, Resume } from "../../types/shared.js";

const resumeService = new ResumeService();

function resolveId(req: Request): string | null {
  const raw = req.params["id"];
  const id  = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  return isValidObjectId(id) ? id : null;
}

export async function listResumes(req: Request, res: Response): Promise<void> {
  const resumes = await resumeService.getAllByUser(req.userId!);
  res.json({ message: "Resumes fetched", data: resumes } satisfies ApiResponse<Resume[]>);
}

export async function getResume(req: Request, res: Response): Promise<void> {
  const id = resolveId(req);
  if (!id) { res.status(400).json({ message: "Invalid resume ID" }); return; }
  const resume = await resumeService.getById(id, req.userId!);
  if (!resume) { res.status(404).json({ message: "Resume not found" }); return; }
  res.json({ message: "Resume fetched", data: resume } satisfies ApiResponse<Resume>);
}

export async function getPublicResume(req: Request, res: Response): Promise<void> {
  const id = resolveId(req);
  if (!id) { res.status(400).json({ message: "Invalid resume ID" }); return; }
  const resume = await resumeService.getPublicById(id);
  if (!resume) { res.status(404).json({ message: "Resume not found" }); return; }
  res.json({ message: "Resume fetched", data: resume } satisfies ApiResponse<Resume>);
}

export async function createResume(req: Request, res: Response): Promise<void> {
  const parsed = createResumeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
    return;
  }
  const resume = await resumeService.create(req.userId!, parsed.data);
  res.status(201).json({ message: "Resume created", data: resume } satisfies ApiResponse<Resume>);
}

export async function duplicateResume(req: Request, res: Response): Promise<void> {
  const id = resolveId(req);
  if (!id) { res.status(400).json({ message: "Invalid resume ID" }); return; }
  const resume = await resumeService.duplicate(id, req.userId!);
  if (!resume) { res.status(404).json({ message: "Resume not found" }); return; }
  res.status(201).json({ message: "Resume duplicated", data: resume } satisfies ApiResponse<Resume>);
}

export async function updateResume(req: Request, res: Response): Promise<void> {
  const id = resolveId(req);
  if (!id) { res.status(400).json({ message: "Invalid resume ID" }); return; }
  const parsed = updateResumeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
    return;
  }
  const resume = await resumeService.update(id, req.userId!, parsed.data);
  if (!resume) { res.status(404).json({ message: "Resume not found" }); return; }
  res.json({ message: "Resume updated", data: resume } satisfies ApiResponse<Resume>);
}

export async function deleteResume(req: Request, res: Response): Promise<void> {
  const id = resolveId(req);
  if (!id) { res.status(400).json({ message: "Invalid resume ID" }); return; }
  const deleted = await resumeService.delete(id, req.userId!);
  if (!deleted) { res.status(404).json({ message: "Resume not found" }); return; }
  res.json({ message: "Resume deleted" } satisfies ApiResponse);
}

export async function saveVersion(req: Request, res: Response): Promise<void> {
  const id = resolveId(req);
  if (!id) { res.status(400).json({ message: "Invalid resume ID" }); return; }
  const resume = await resumeService.saveVersion(id, req.userId!);
  if (!resume) { res.status(404).json({ message: "Resume not found" }); return; }
  res.json({ message: "Version saved", data: resume } satisfies ApiResponse<Resume>);
}

export async function restoreVersion(req: Request, res: Response): Promise<void> {
  const id = resolveId(req);
  if (!id) { res.status(400).json({ message: "Invalid resume ID" }); return; }
  const raw = req.params["snapshotId"];
  const snapshotId = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  if (!snapshotId) { res.status(400).json({ message: "Invalid snapshot ID" }); return; }
  const resume = await resumeService.restoreVersion(id, req.userId!, snapshotId);
  if (!resume) { res.status(404).json({ message: "Version not found" }); return; }
  res.json({ message: "Version restored", data: resume } satisfies ApiResponse<Resume>);
}
