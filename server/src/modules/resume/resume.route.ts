import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  listResumes, getResume, getPublicResume,
  createResume, duplicateResume,
  updateResume, deleteResume,
  saveVersion, restoreVersion,
} from "./resume.controller.js";

const router = Router();

// Public — no auth
router.get("/public/:id", asyncHandler(getPublicResume));

// Protected
router.use(authenticate);
router.get("/",                              asyncHandler(listResumes));
router.get("/:id",                           asyncHandler(getResume));
router.post("/",                             asyncHandler(createResume));
router.post("/:id/duplicate",               asyncHandler(duplicateResume));
router.post("/:id/versions",                asyncHandler(saveVersion));
router.post("/:id/versions/:snapshotId/restore", asyncHandler(restoreVersion));
router.put("/:id",                           asyncHandler(updateResume));
router.delete("/:id",                        asyncHandler(deleteResume));

export { router as resumeRouter };
