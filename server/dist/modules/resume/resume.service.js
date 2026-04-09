"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const resume_schema_js_1 = require("./resume.schema.js");
function toResume(doc) {
    const toIso = (v) => v instanceof Date ? v.toISOString() : String(v ?? "");
    return {
        _id: String(doc["_id"]),
        userId: String(doc["userId"]),
        title: String(doc["title"] ?? ""),
        isPublic: Boolean(doc["isPublic"]),
        template: doc["template"] ?? "classic",
        accentColor: String(doc["accentColor"] ?? "#2563EB"),
        professionalSummary: String(doc["professionalSummary"] ?? ""),
        personalInfo: (doc["personalInfo"] ?? {}),
        experience: (doc["experience"] ?? []),
        education: (doc["education"] ?? []),
        projects: (doc["projects"] ?? []),
        certifications: (doc["certifications"] ?? []),
        skills: (doc["skills"] ?? []),
        createdAt: toIso(doc["createdAt"]),
        updatedAt: toIso(doc["updatedAt"]),
    };
}
class ResumeService {
    async getAllByUser(userId) {
        const docs = await resume_schema_js_1.ResumeModel
            .find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .sort({ updatedAt: -1 })
            .lean();
        // lean() returns plain objects — cast through unknown to satisfy Record<string,unknown>
        return docs.map(toResume);
    }
    async getById(resumeId, userId) {
        const doc = await resume_schema_js_1.ResumeModel.findOne({
            _id: new mongoose_1.default.Types.ObjectId(resumeId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        }).lean();
        return doc ? toResume(doc) : null;
    }
    async getPublicById(resumeId) {
        const doc = await resume_schema_js_1.ResumeModel.findOne({
            _id: new mongoose_1.default.Types.ObjectId(resumeId),
            isPublic: true,
        }).lean();
        return doc ? toResume(doc) : null;
    }
    async create(userId, input) {
        const doc = await resume_schema_js_1.ResumeModel.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            title: input.title,
        });
        // toObject() returns a plain POJO — cast through unknown
        return toResume(doc.toObject());
    }
    async update(resumeId, userId, input) {
        const doc = await resume_schema_js_1.ResumeModel.findOneAndUpdate({
            _id: new mongoose_1.default.Types.ObjectId(resumeId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        }, { $set: input }, { new: true, runValidators: true }).lean();
        return doc ? toResume(doc) : null;
    }
    async delete(resumeId, userId) {
        const result = await resume_schema_js_1.ResumeModel.findOneAndDelete({
            _id: new mongoose_1.default.Types.ObjectId(resumeId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        return result !== null;
    }
}
exports.ResumeService = ResumeService;
//# sourceMappingURL=resume.service.js.map