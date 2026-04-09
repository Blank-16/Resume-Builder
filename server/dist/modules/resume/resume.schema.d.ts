import mongoose, { Document, Model } from "mongoose";
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
export declare const ResumeModel: Model<ResumeDocument>;
//# sourceMappingURL=resume.schema.d.ts.map