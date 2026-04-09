import mongoose from "mongoose";
import { ResumeModel } from "./resume.schema.js";
import type { CreateResumeInput, UpdateResumeInput } from "./resume.validation.js";
import type { Resume } from "../../types/shared.js";

function toResume(doc: Record<string, unknown>): Resume {
  const toIso = (v: unknown): string =>
    v instanceof Date ? v.toISOString() : String(v ?? "");

  return {
    _id:                String(doc["_id"]),
    userId:             String(doc["userId"]),
    title:              String(doc["title"] ?? ""),
    isPublic:           Boolean(doc["isPublic"]),
    template:           (doc["template"] as Resume["template"]) ?? "classic",
    accentColor:        String(doc["accentColor"] ?? "#2563EB"),
    professionalSummary:String(doc["professionalSummary"] ?? ""),
    personalInfo:       (doc["personalInfo"] ?? {}) as Resume["personalInfo"],
    experience:         (doc["experience"]  ?? []) as Resume["experience"],
    education:          (doc["education"]   ?? []) as Resume["education"],
    projects:           (doc["projects"]    ?? []) as Resume["projects"],
    certifications:     (doc["certifications"] ?? []) as Resume["certifications"],
    skills:             (doc["skills"]      ?? []) as string[],
    createdAt:          toIso(doc["createdAt"]),
    updatedAt:          toIso(doc["updatedAt"]),
  };
}

export class ResumeService {
  async getAllByUser(userId: string): Promise<Resume[]> {
    const docs = await ResumeModel
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .lean();
    // lean() returns plain objects — cast through unknown to satisfy Record<string,unknown>
    return (docs as unknown as Record<string, unknown>[]).map(toResume);
  }

  async getById(resumeId: string, userId: string): Promise<Resume | null> {
    const doc = await ResumeModel.findOne({
      _id:    new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    return doc ? toResume(doc as unknown as Record<string, unknown>) : null;
  }

  async getPublicById(resumeId: string): Promise<Resume | null> {
    const doc = await ResumeModel.findOne({
      _id:      new mongoose.Types.ObjectId(resumeId),
      isPublic: true,
    }).lean();
    return doc ? toResume(doc as unknown as Record<string, unknown>) : null;
  }

  async create(userId: string, input: CreateResumeInput): Promise<Resume> {
    const doc = await ResumeModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      title:  input.title,
    });
    // toObject() returns a plain POJO — cast through unknown
    return toResume(doc.toObject() as unknown as Record<string, unknown>);
  }

  async update(
    resumeId: string,
    userId:   string,
    input:    UpdateResumeInput
  ): Promise<Resume | null> {
    const doc = await ResumeModel.findOneAndUpdate(
      {
        _id:    new mongoose.Types.ObjectId(resumeId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      { $set: input },
      { new: true, runValidators: true }
    ).lean();
    return doc ? toResume(doc as unknown as Record<string, unknown>) : null;
  }

  async delete(resumeId: string, userId: string): Promise<boolean> {
    const result = await ResumeModel.findOneAndDelete({
      _id:    new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    return result !== null;
  }
}
