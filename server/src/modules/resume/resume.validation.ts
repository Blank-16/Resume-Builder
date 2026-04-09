import { z } from "zod";

const templateIdSchema = z.enum(["classic", "modern", "minimal", "executive"]);

const personalInfoSchema = z.object({
  fullName: z.string().default(""),
  email: z.string().email().or(z.literal("")).default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  linkedin: z.string().default(""),
  website: z.string().default(""),
  github: z.string().default(""),
  image: z.string().default(""),
});

const experienceSchema = z.object({
  id: z.string(),
  company: z.string().default(""),
  position: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  isCurrent: z.boolean().default(false),
  description: z.string().default(""),
});

const educationSchema = z.object({
  id: z.string(),
  institution: z.string().default(""),
  degree: z.string().default(""),
  field: z.string().default(""),
  graduationDate: z.string().default(""),
  gpa: z.string().default(""),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  type: z.string().default(""),
  description: z.string().default(""),
  url: z.string().default(""),
  technologies: z.array(z.string()).default([]),
});

const certificationSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  issuer: z.string().default(""),
  date: z.string().default(""),
  url: z.string().default(""),
});

export const createResumeSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
});

export const updateResumeSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  isPublic: z.boolean().optional(),
  template: templateIdSchema.optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
    .optional(),
  professionalSummary: z.string().optional(),
  personalInfo: personalInfoSchema.partial().optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  skills: z.array(z.string()).optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
