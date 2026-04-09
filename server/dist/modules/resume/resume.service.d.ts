import type { CreateResumeInput, UpdateResumeInput } from "./resume.validation.js";
import type { Resume } from "../../types/shared.js";
export declare class ResumeService {
    getAllByUser(userId: string): Promise<Resume[]>;
    getById(resumeId: string, userId: string): Promise<Resume | null>;
    getPublicById(resumeId: string): Promise<Resume | null>;
    create(userId: string, input: CreateResumeInput): Promise<Resume>;
    update(resumeId: string, userId: string, input: UpdateResumeInput): Promise<Resume | null>;
    delete(resumeId: string, userId: string): Promise<boolean>;
}
//# sourceMappingURL=resume.service.d.ts.map