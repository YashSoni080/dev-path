import rateLimit from "express-rate-limit";

// Brute-force protection for auth endpoints (login, register, OTP)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // max 50 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts. Please try again later." },
});

// General API limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
});