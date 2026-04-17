import { Router } from "express";
import { register, login, refresh, logoutHandler, getMe } from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  loginLimiter, registerLimiter, refreshLimiter,
} from "../../middleware/rateLimiter.js";

const router = Router();

router.post("/register", registerLimiter, asyncHandler(register));
router.post("/login",    loginLimiter,    asyncHandler(login));
router.post("/refresh",  refreshLimiter,  asyncHandler(refresh));
router.post("/logout",   authenticate,    asyncHandler(logoutHandler));
router.get("/me",        authenticate,    asyncHandler(getMe));

export { router as authRouter };
