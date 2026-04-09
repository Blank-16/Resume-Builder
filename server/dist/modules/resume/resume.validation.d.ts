import { z } from "zod";
export declare const createResumeSchema: z.ZodObject<{
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
}, {
    title: string;
}>;
export declare const updateResumeSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodOptional<z.ZodBoolean>;
    template: z.ZodOptional<z.ZodEnum<["classic", "modern", "minimal", "executive"]>>;
    accentColor: z.ZodOptional<z.ZodString>;
    professionalSummary: z.ZodOptional<z.ZodString>;
    personalInfo: z.ZodOptional<z.ZodObject<{
        fullName: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        email: z.ZodOptional<z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
        phone: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        location: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        linkedin: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        website: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        github: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        image: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        fullName?: string | undefined;
        phone?: string | undefined;
        location?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
        github?: string | undefined;
        image?: string | undefined;
    }, {
        email?: string | undefined;
        fullName?: string | undefined;
        phone?: string | undefined;
        location?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
        github?: string | undefined;
        image?: string | undefined;
    }>>;
    experience: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        company: z.ZodDefault<z.ZodString>;
        position: z.ZodDefault<z.ZodString>;
        startDate: z.ZodDefault<z.ZodString>;
        endDate: z.ZodDefault<z.ZodString>;
        isCurrent: z.ZodDefault<z.ZodBoolean>;
        description: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        position: string;
        description: string;
        company: string;
        startDate: string;
        endDate: string;
        isCurrent: boolean;
    }, {
        id: string;
        position?: string | undefined;
        description?: string | undefined;
        company?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        isCurrent?: boolean | undefined;
    }>, "many">>;
    education: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        institution: z.ZodDefault<z.ZodString>;
        degree: z.ZodDefault<z.ZodString>;
        field: z.ZodDefault<z.ZodString>;
        graduationDate: z.ZodDefault<z.ZodString>;
        gpa: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        institution: string;
        degree: string;
        field: string;
        graduationDate: string;
        gpa: string;
    }, {
        id: string;
        institution?: string | undefined;
        degree?: string | undefined;
        field?: string | undefined;
        graduationDate?: string | undefined;
        gpa?: string | undefined;
    }>, "many">>;
    projects: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodDefault<z.ZodString>;
        type: z.ZodDefault<z.ZodString>;
        description: z.ZodDefault<z.ZodString>;
        url: z.ZodDefault<z.ZodString>;
        technologies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        name: string;
        id: string;
        description: string;
        url: string;
        technologies: string[];
    }, {
        id: string;
        type?: string | undefined;
        name?: string | undefined;
        description?: string | undefined;
        url?: string | undefined;
        technologies?: string[] | undefined;
    }>, "many">>;
    certifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodDefault<z.ZodString>;
        issuer: z.ZodDefault<z.ZodString>;
        date: z.ZodDefault<z.ZodString>;
        url: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        date: string;
        url: string;
        issuer: string;
    }, {
        id: string;
        name?: string | undefined;
        date?: string | undefined;
        url?: string | undefined;
        issuer?: string | undefined;
    }>, "many">>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    isPublic?: boolean | undefined;
    template?: "classic" | "modern" | "minimal" | "executive" | undefined;
    accentColor?: string | undefined;
    professionalSummary?: string | undefined;
    personalInfo?: {
        email?: string | undefined;
        fullName?: string | undefined;
        phone?: string | undefined;
        location?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
        github?: string | undefined;
        image?: string | undefined;
    } | undefined;
    experience?: {
        id: string;
        position: string;
        description: string;
        company: string;
        startDate: string;
        endDate: string;
        isCurrent: boolean;
    }[] | undefined;
    education?: {
        id: string;
        institution: string;
        degree: string;
        field: string;
        graduationDate: string;
        gpa: string;
    }[] | undefined;
    projects?: {
        type: string;
        name: string;
        id: string;
        description: string;
        url: string;
        technologies: string[];
    }[] | undefined;
    certifications?: {
        name: string;
        id: string;
        date: string;
        url: string;
        issuer: string;
    }[] | undefined;
    skills?: string[] | undefined;
}, {
    title?: string | undefined;
    isPublic?: boolean | undefined;
    template?: "classic" | "modern" | "minimal" | "executive" | undefined;
    accentColor?: string | undefined;
    professionalSummary?: string | undefined;
    personalInfo?: {
        email?: string | undefined;
        fullName?: string | undefined;
        phone?: string | undefined;
        location?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
        github?: string | undefined;
        image?: string | undefined;
    } | undefined;
    experience?: {
        id: string;
        position?: string | undefined;
        description?: string | undefined;
        company?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        isCurrent?: boolean | undefined;
    }[] | undefined;
    education?: {
        id: string;
        institution?: string | undefined;
        degree?: string | undefined;
        field?: string | undefined;
        graduationDate?: string | undefined;
        gpa?: string | undefined;
    }[] | undefined;
    projects?: {
        id: string;
        type?: string | undefined;
        name?: string | undefined;
        description?: string | undefined;
        url?: string | undefined;
        technologies?: string[] | undefined;
    }[] | undefined;
    certifications?: {
        id: string;
        name?: string | undefined;
        date?: string | undefined;
        url?: string | undefined;
        issuer?: string | undefined;
    }[] | undefined;
    skills?: string[] | undefined;
}>;
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
//# sourceMappingURL=resume.validation.d.ts.map