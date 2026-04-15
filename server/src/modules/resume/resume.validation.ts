import { z } from "zod";

const templateIdSchema = z.enum(["classic", "modern", "minimal", "executive", "home_college", "general_template"]);

// Allow empty string OR a valid URL — used for optional link fields
const urlOrEmpty = z.string().refine(
  (v) => v === "" || /^https?:\/\/.+/.test(v),
  { message: "Must be a valid URL or empty" }
).default("");

const personalInfoSchema = z.object({
  fullName: z.string().max(120).default(""),
  email:    z.string().email().or(z.literal("")).default(""),
  phone:    z.string().max(30).default(""),
  location: z.string().max(100).default(""),
  linkedin: urlOrEmpty,
  website:  urlOrEmpty,
  github:   urlOrEmpty,
  image:    z.string().default(""),
});

const experienceSchema = z.object({
  id:          z.string(),
  company:     z.string().max(120).default(""),
  position:    z.string().max(120).default(""),
  startDate:   z.string().default(""),
  endDate:     z.string().default(""),
  isCurrent:   z.boolean().default(false),
  description: z.string().max(2000).default(""),
});

const educationSchema = z.object({
  id:             z.string(),
  institution:    z.string().max(120).default(""),
  degree:         z.string().max(120).default(""),
  field:          z.string().max(120).default(""),
  graduationDate: z.string().default(""),
  gpa:            z.string().max(10).default(""),
});

const projectSchema = z.object({
  id:           z.string(),
  name:         z.string().max(120).default(""),
  type:         z.string().max(60).default(""),
  description:  z.string().max(1000).default(""),
  url:          urlOrEmpty,
  technologies: z.array(z.string().max(50)).max(20).default([]),
});

const certificationSchema = z.object({
  id:     z.string(),
  name:   z.string().max(120).default(""),
  issuer: z.string().max(120).default(""),
  date:   z.string().default(""),
  url:    urlOrEmpty,
});

export const createResumeSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
});

export const updateResumeSchema = z.object({
  title:               z.string().min(1).max(100).optional(),
  isPublic:            z.boolean().optional(),
  template:            templateIdSchema.optional(),
  accentColor:         z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional(),
  professionalSummary: z.string().max(2000).optional(),
  personalInfo:        personalInfoSchema.partial().optional(),
  experience:          z.array(experienceSchema).max(20).optional(),
  education:           z.array(educationSchema).max(10).optional(),
  projects:            z.array(projectSchema).max(20).optional(),
  certifications:      z.array(certificationSchema).max(20).optional(),
  skills:              z.array(z.string().max(50)).max(50).optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
