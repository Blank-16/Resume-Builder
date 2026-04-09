"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listResumes = listResumes;
exports.getResume = getResume;
exports.getPublicResume = getPublicResume;
exports.createResume = createResume;
exports.updateResume = updateResume;
exports.deleteResume = deleteResume;
const mongoose_1 = require("mongoose");
const resume_service_js_1 = require("./resume.service.js");
const resume_validation_js_1 = require("./resume.validation.js");
const resumeService = new resume_service_js_1.ResumeService();
// Returns the id string if it is a valid ObjectId, otherwise null.
// req.params["id"] is typed as string | string[] in Express — we normalise it here.
function resolveId(req) {
    const raw = req.params["id"];
    const id = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
    return (0, mongoose_1.isValidObjectId)(id) ? id : null;
}
async function listResumes(req, res) {
    const resumes = await resumeService.getAllByUser(req.userId);
    res.json({ message: "Resumes fetched", data: resumes });
}
async function getResume(req, res) {
    const id = resolveId(req);
    if (!id) {
        res.status(400).json({ message: "Invalid resume ID" });
        return;
    }
    const resume = await resumeService.getById(id, req.userId);
    if (!resume) {
        res.status(404).json({ message: "Resume not found" });
        return;
    }
    res.json({
        message: "Resume fetched",
        data: resume,
    });
}
async function getPublicResume(req, res) {
    const id = resolveId(req);
    if (!id) {
        res.status(400).json({ message: "Invalid resume ID" });
        return;
    }
    const resume = await resumeService.getPublicById(id);
    if (!resume) {
        res.status(404).json({ message: "Resume not found" });
        return;
    }
    res.json({
        message: "Resume fetched",
        data: resume,
    });
}
async function createResume(req, res) {
    const parsed = resume_validation_js_1.createResumeSchema.safeParse(req.body);
    if (!parsed.success) {
        res
            .status(400)
            .json({
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }
    const resume = await resumeService.create(req.userId, parsed.data);
    res
        .status(201)
        .json({
        message: "Resume created",
        data: resume,
    });
}
async function updateResume(req, res) {
    const id = resolveId(req);
    if (!id) {
        res.status(400).json({ message: "Invalid resume ID" });
        return;
    }
    const parsed = resume_validation_js_1.updateResumeSchema.safeParse(req.body);
    if (!parsed.success) {
        res
            .status(400)
            .json({
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }
    const resume = await resumeService.update(id, req.userId, parsed.data);
    if (!resume) {
        res.status(404).json({ message: "Resume not found" });
        return;
    }
    res.json({
        message: "Resume updated",
        data: resume,
    });
}
async function deleteResume(req, res) {
    const id = resolveId(req);
    if (!id) {
        res.status(400).json({ message: "Invalid resume ID" });
        return;
    }
    const deleted = await resumeService.delete(id, req.userId);
    if (!deleted) {
        res.status(404).json({ message: "Resume not found" });
        return;
    }
    res.json({ message: "Resume deleted" });
}
//# sourceMappingURL=resume.controller.js.map