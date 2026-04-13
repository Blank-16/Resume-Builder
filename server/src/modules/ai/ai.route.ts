import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/authenticate.js";
import { aiLimiter } from "../../middleware/rateLimiter.js";
import { suggestContent } from "./ai.controller.js";

const router = Router();

router.post("/suggest", authenticate, aiLimiter, asyncHandler(suggestContent));

export { router as aiRouter };
