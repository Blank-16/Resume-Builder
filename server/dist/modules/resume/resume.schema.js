"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PersonalInfoSchema = new mongoose_1.Schema({
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
    github: { type: String, default: "" },
    image: { type: String, default: "" },
}, { _id: false });
const ExperienceSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    company: { type: String, default: "" },
    position: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: "" },
}, { _id: false });
const EducationSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    field: { type: String, default: "" },
    graduationDate: { type: String, default: "" },
    gpa: { type: String, default: "" },
}, { _id: false });
const ProjectSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, default: "" },
    type: { type: String, default: "" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    technologies: { type: [String], default: [] },
}, { _id: false });
const CertificationSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, default: "" },
    issuer: { type: String, default: "" },
    date: { type: String, default: "" },
    url: { type: String, default: "" },
}, { _id: false });
const templateIds = ["classic", "modern", "minimal", "executive"];
const ResumeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: { type: String, default: "Untitled Resume" },
    isPublic: { type: Boolean, default: false },
    template: {
        type: String,
        enum: templateIds,
        default: "classic",
    },
    accentColor: { type: String, default: "#2563EB" },
    professionalSummary: { type: String, default: "" },
    personalInfo: { type: PersonalInfoSchema, default: () => ({}) },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    skills: { type: [String], default: [] },
}, { timestamps: true, minimize: false });
ResumeSchema.index({ userId: 1, updatedAt: -1 });
exports.ResumeModel = mongoose_1.default.model("Resume", ResumeSchema);
//# sourceMappingURL=resume.schema.js.map