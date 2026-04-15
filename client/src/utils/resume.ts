import type { Resume } from "@/types";

// Use crypto.randomUUID() for collision-free IDs.
// Falls back to a timestamp+random string in environments without crypto.
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!year) return "";
  return new Date(Number(year), Number(month ?? 1) - 1).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "short",
  });
}

export function createEmptyPersonalInfo(): Resume["personalInfo"] {
  return {
    fullName: "",
    email:    "",
    phone:    "",
    location: "",
    linkedin: "",
    website:  "",
    github:   "",
    image:    "",
  };
}

export function createEmptyResume(): Resume {
  return {
    _id:                 "",
    userId:              "",
    title:               "Untitled Resume",
    isPublic:            false,
    template:            "classic",
    accentColor:         "#2563EB",
    professionalSummary: "",
    personalInfo:        createEmptyPersonalInfo(),
    experience:          [],
    education:           [],
    projects:            [],
    certifications:      [],
    skills:              [],
    versions:            [],   // added — matches Resume type
    createdAt:           "",
    updatedAt:           "",
  };
}
