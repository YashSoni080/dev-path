import express from "express";
import {
    registerUser,
    verifyOtpCode,
    resendOtp,
    loginUser,
    logoutUser,
    getProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/verify-otp", authLimiter, verifyOtpCode);
router.post("/resend-otp", authLimiter, resendOtp);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getProfile);

export default router;
