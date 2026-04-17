import mongoose from "mongoose";
import { ResumeModel } from "./resume.schema.js";
import type { CreateResumeInput, UpdateResumeInput } from "./resume.validation.js";
import type { Resume, ResumeSnapshot } from "../../types/shared.js";

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
    versions:           (doc["versions"]    ?? []) as ResumeSnapshot[],
    createdAt:          toIso(doc["createdAt"]),
    updatedAt:          toIso(doc["updatedAt"]),
  };
}

function asRecord(doc: unknown): Record<string, unknown> {
  return doc as unknown as Record<string, unknown>;
}

export class ResumeService {
  async getAllByUser(userId: string): Promise<Resume[]> {
    const docs = await ResumeModel
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .select("-versions") // omit large versions array from list view
      .lean();
    return (docs as unknown as Record<string, unknown>[]).map((d) =>
      toResume({ ...d, versions: [] })
    );
  }

  async getById(resumeId: string, userId: string): Promise<Resume | null> {
    const doc = await ResumeModel.findOne({
      _id:    new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    return doc ? toResume(asRecord(doc)) : null;
  }

  async getPublicById(resumeId: string): Promise<Resume | null> {
    const doc = await ResumeModel.findOne({
      _id:      new mongoose.Types.ObjectId(resumeId),
      isPublic: true,
    }).lean();
    return doc ? toResume(asRecord(doc)) : null;
  }

  async create(userId: string, input: CreateResumeInput): Promise<Resume> {
    const doc = await ResumeModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      title:  input.title,
    });
    return toResume(doc.toObject() as unknown as Record<string, unknown>);
  }

  async duplicate(resumeId: string, userId: string): Promise<Resume | null> {
    const src = await ResumeModel.findOne({
      _id:    new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    if (!src) return null;

    const { _id, createdAt, updatedAt, versions, ...fields } = asRecord(src);
    void _id; void createdAt; void updatedAt; void versions;

    const copy = await ResumeModel.create({
      ...fields,
      title: `${String(fields["title"] ?? "Resume")} (copy)`,
      versions: [],
    });
    return toResume(copy.toObject() as unknown as Record<string, unknown>);
  }

  async update(
    resumeId: string,
    userId:   string,
    input:    UpdateResumeInput
  ): Promise<Resume | null> {
    const doc = await ResumeModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(resumeId), userId: new mongoose.Types.ObjectId(userId) },
      { $set: input },
      { new: true, runValidators: true }
    ).lean();
    return doc ? toResume(asRecord(doc)) : null;
  }

  async delete(resumeId: string, userId: string): Promise<boolean> {
    const result = await ResumeModel.findOneAndDelete({
      _id:    new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    return result !== null;
  }

  // Save a snapshot to version history (max 10, drops oldest when full)
  async saveVersion(resumeId: string, userId: string): Promise<Resume | null> {
    const current = await ResumeModel.findOne({
      _id:    new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    if (!current) return null;

    const rec = asRecord(current);
    const snapshot: ResumeSnapshot = {
      snapshotId: new mongoose.Types.ObjectId().toHexString(),
      savedAt:    new Date().toISOString(),
      title:      String(rec["title"] ?? ""),
      content:    JSON.stringify({
        template:            rec["template"],
        accentColor:         rec["accentColor"],
        professionalSummary: rec["professionalSummary"],
        personalInfo:        rec["personalInfo"],
        experience:          rec["experience"],
        education:           rec["education"],
        projects:            rec["projects"],
        certifications:      rec["certifications"],
        skills:              rec["skills"],
      }),
    };

    const existing = (rec["versions"] as ResumeSnapshot[] | undefined) ?? [];
    // Keep only 9 most recent, then push the new one
    const trimmed  = existing.slice(-9);

    const updated = await ResumeModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(resumeId), userId: new mongoose.Types.ObjectId(userId) },
      { $set: { versions: [...trimmed, snapshot] } },
      { new: true }
    ).lean();
    return updated ? toResume(asRecord(updated)) : null;
  }

  // Restore a previous version's content
  async restoreVersion(
    resumeId:   string,
    userId:     string,
    snapshotId: string
  ): Promise<Resume | null> {
    const current = await ResumeModel.findOne({
      _id:    new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    if (!current) return null;

    const rec      = asRecord(current);
    const versions = (rec["versions"] as ResumeSnapshot[] | undefined) ?? [];
    const snapshot = versions.find((v) => v.snapshotId === snapshotId);
    if (!snapshot) return null;

    const content = JSON.parse(snapshot.content) as Partial<Record<string, unknown>>;

    const updated = await ResumeModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(resumeId), userId: new mongoose.Types.ObjectId(userId) },
      { $set: { ...content, title: snapshot.title } },
      { new: true }
    ).lean();
    return updated ? toResume(asRecord(updated)) : null;
  }
}
