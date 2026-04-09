import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import {
  listResumes,
  getResume,
  getPublicResume,
  createResume,
  updateResume,
  deleteResume,
} from "./resume.controller.js";

const router = Router();

// Public route - no auth required
router.get("/public/:id", getPublicResume);

// Protected routes
router.use(authenticate);
router.get("/", listResumes);
router.get("/:id", getResume);
router.post("/", createResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

export { router as resumeRouter };
