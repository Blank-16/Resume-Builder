import mongoose, { Schema, Document, Model } from "mongoose";
import type { Resume, TemplateId } from "../../types/shared.js";

export interface ResumeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  isPublic: boolean;
  template: TemplateId;
  accentColor: string;
  professionalSummary: string;
  personalInfo: Resume["personalInfo"];
  experience: Resume["experience"];
  education: Resume["education"];
  projects: Resume["projects"];
  certifications: Resume["certifications"];
  skills: string[];
}

const PersonalInfoSchema = new Schema(
  {
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
    github: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const ExperienceSchema = new Schema(
  {
    id: { type: String, required: true },
    company: { type: String, default: "" },
    position: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const EducationSchema = new Schema(
  {
    id: { type: String, required: true },
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    field: { type: String, default: "" },
    graduationDate: { type: String, default: "" },
    gpa: { type: String, default: "" },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: "" },
    type: { type: String, default: "" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    technologies: { type: [String], default: [] },
  },
  { _id: false }
);

const CertificationSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: "" },
    issuer: { type: String, default: "" },
    date: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: false }
);

const templateIds: TemplateId[] = ["classic", "modern", "minimal", "executive"];

const ResumeSchema = new Schema<ResumeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "Untitled Resume" },
    isPublic: { type: Boolean, default: false },
    template: {
      type: String,
      enum: templateIds,
      default: "classic",
    },
    accentColor: { type: String, default: "#2563EB" },
    professionalSummary: { type: String, default: "" },
    personalInfo: { type: PersonalInfoSchema, default: () => ({}) },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    skills: { type: [String], default: [] },
  },
  { timestamps: true, minimize: false }
);

ResumeSchema.index({ userId: 1, updatedAt: -1 });

export const ResumeModel: Model<ResumeDocument> = mongoose.model<ResumeDocument>(
  "Resume",
  ResumeSchema
);
