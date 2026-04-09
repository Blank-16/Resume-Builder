"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeRouter = void 0;
const express_1 = require("express");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const resume_controller_js_1 = require("./resume.controller.js");
const router = (0, express_1.Router)();
exports.resumeRouter = router;
// Public route - no auth required
router.get("/public/:id", resume_controller_js_1.getPublicResume);
// Protected routes
router.use(authenticate_js_1.authenticate);
router.get("/", resume_controller_js_1.listResumes);
router.get("/:id", resume_controller_js_1.getResume);
router.post("/", resume_controller_js_1.createResume);
router.put("/:id", resume_controller_js_1.updateResume);
router.delete("/:id", resume_controller_js_1.deleteResume);
//# sourceMappingURL=resume.route.js.map