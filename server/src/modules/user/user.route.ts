import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { updateProfile, changePassword, deleteAccount } from "./user.controller.js";

const router = Router();

router.use(authenticate);
router.put("/me",              asyncHandler(updateProfile));
router.put("/me/password",     asyncHandler(changePassword));
router.delete("/me",           asyncHandler(deleteAccount));

export { router as userRouter };
