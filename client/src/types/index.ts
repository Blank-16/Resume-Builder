// All shared types used throughout the client

export type TemplateId = "classic" | "modern" | "minimal" | "executive";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  github: string;
  image: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  isPublic: boolean;
  template: TemplateId;
  accentColor: string;
  professionalSummary: string;
  personalInfo: PersonalInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export type ResumeUpdatePayload = Partial<
  Omit<Resume, "_id" | "userId" | "createdAt" | "updatedAt">
>;

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface ApiResponse<T = undefined> {
  message: string;
  data?: T;
}

export interface TemplateProps {
  resume: Resume;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
}
