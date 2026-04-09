export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!year) return "";
  return new Date(Number(year), Number(month ?? 1) - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function createEmptyPersonalInfo() {
  return {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    github: "",
    image: "",
  };
}

export function createEmptyResume() {
  return {
    _id: "",
    userId: "",
    title: "Untitled Resume",
    isPublic: false,
    template: "classic" as const,
    accentColor: "#2563EB",
    professionalSummary: "",
    personalInfo: createEmptyPersonalInfo(),
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    skills: [],
    createdAt: "",
    updatedAt: "",
  };
}
