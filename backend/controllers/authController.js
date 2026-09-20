import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateOtp,
  hashOtp,
  verifyOtp,
  sendOtpEmail,
  OTP_TTL_MS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
} from "../utils/otp.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

// @desc   Register a new user (sends OTP for verification)
// @route  POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const otp = generateOtp();
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      otp: {
        code: await hashOtp(otp),
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
        attempts: 0,
        lastSentAt: new Date(),
      },
    });

    await sendOtpEmail(user.email, otp);

    res.status(201).json({
      message: "Account created. Enter the 6-digit code sent to your email to verify.",
      email: user.email,
      requiresOtp: true,
      debugOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Verify email with OTP
// @route  POST /api/auth/verify-otp
export const verifyOtpCode = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for this email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "This account is already verified" });
    }

    if (!user.otp?.code || !user.otp?.expiresAt) {
      return res.status(400).json({ message: "No verification code was issued. Please register again." });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "This code has expired. Request a new one." });
    }

    if (user.otp.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        message: "Too many incorrect attempts. Request a new code.",
      });
    }

    const isValid = await verifyOtp(otp, user.otp.code);
    if (!isValid) {
      user.otp.attempts += 1;
      await user.save();
      const remaining = OTP_MAX_ATTEMPTS - user.otp.attempts;
      return res.status(400).json({
        message:
          remaining > 0
            ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
            : "Too many incorrect attempts. Request a new code.",
      });
    }

    user.isVerified = true;
    user.otp = { code: null, expiresAt: null, attempts: 0, lastSentAt: null };
    await user.save();

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.json({ message: "Email verified. Welcome to DevPath!", user: user.toSafeJSON() });
  } catch (error) {
    next(error);
  }
};

// @desc   Resend a new OTP
// @route  POST /api/auth/resend-otp
export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for this email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "This account is already verified" });
    }

    // Rate-limit resends: one per minute
    if (user.otp?.lastSentAt && Date.now() - new Date(user.otp.lastSentAt).getTime() < OTP_RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil(
        (OTP_RESEND_COOLDOWN_MS - (Date.now() - new Date(user.otp.lastSentAt).getTime())) / 1000
      );
      return res.status(429).json({ message: `Please wait ${waitSec}s before requesting a new code.` });
    }

    const otp = generateOtp();
    user.otp = {
      code: await hashOtp(otp),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      attempts: 0,
      lastSentAt: new Date(),
    };
    await user.save();

    await sendOtpEmail(user.email, otp);

    res.json({
      message: "A new code has been sent to your email.",
      debugOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Login user (verified users only)
// @route  POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first.",
        requiresOtp: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.json({ message: "Logged in successfully", user: user.toSafeJSON() });
  } catch (error) {
    next(error);
  }
};

// @desc   Log out the current user
// @route  POST /api/auth/logout
export const logoutUser = (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
};

// @desc   Get logged-in user's profile
// @route  GET /api/auth/me
export const getProfile = async (req, res, next) => {
  try {
    res.json(req.user.toSafeJSON());
  } catch (error) {
    next(error);
  }
};
