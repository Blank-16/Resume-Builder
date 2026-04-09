"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResumeSchema = exports.createResumeSchema = void 0;
const zod_1 = require("zod");
const templateIdSchema = zod_1.z.enum(["classic", "modern", "minimal", "executive"]);
const personalInfoSchema = zod_1.z.object({
    fullName: zod_1.z.string().default(""),
    email: zod_1.z.string().email().or(zod_1.z.literal("")).default(""),
    phone: zod_1.z.string().default(""),
    location: zod_1.z.string().default(""),
    linkedin: zod_1.z.string().default(""),
    website: zod_1.z.string().default(""),
    github: zod_1.z.string().default(""),
    image: zod_1.z.string().default(""),
});
const experienceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    company: zod_1.z.string().default(""),
    position: zod_1.z.string().default(""),
    startDate: zod_1.z.string().default(""),
    endDate: zod_1.z.string().default(""),
    isCurrent: zod_1.z.boolean().default(false),
    description: zod_1.z.string().default(""),
});
const educationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    institution: zod_1.z.string().default(""),
    degree: zod_1.z.string().default(""),
    field: zod_1.z.string().default(""),
    graduationDate: zod_1.z.string().default(""),
    gpa: zod_1.z.string().default(""),
});
const projectSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().default(""),
    type: zod_1.z.string().default(""),
    description: zod_1.z.string().default(""),
    url: zod_1.z.string().default(""),
    technologies: zod_1.z.array(zod_1.z.string()).default([]),
});
const certificationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().default(""),
    issuer: zod_1.z.string().default(""),
    date: zod_1.z.string().default(""),
    url: zod_1.z.string().default(""),
});
exports.createResumeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(100, "Title is too long"),
});
exports.updateResumeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    isPublic: zod_1.z.boolean().optional(),
    template: templateIdSchema.optional(),
    accentColor: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
        .optional(),
    professionalSummary: zod_1.z.string().optional(),
    personalInfo: personalInfoSchema.partial().optional(),
    experience: zod_1.z.array(experienceSchema).optional(),
    education: zod_1.z.array(educationSchema).optional(),
    projects: zod_1.z.array(projectSchema).optional(),
    certifications: zod_1.z.array(certificationSchema).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
});
//# sourceMappingURL=resume.validation.js.map