import crypto from "crypto";
import bcrypt from "bcryptjs";

export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute

/**
 * Generate a random 6-digit OTP and return it in plaintext.
 * Only the hashed version is ever stored.
 */
export const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

export const hashOtp = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
};

export const verifyOtp = async (otp, hashedOtp) => {
    return bcrypt.compare(otp, hashedOtp);
};

/**
 * Send the OTP to the user.
 * In production, plug in your email provider (Nodemailer, Resend, etc.).
 * In development, we log it to the server console so the flow is testable
 * without SMTP credentials.
 */
export const sendOtpEmail = async (email, otp) => {
    if (process.env.NODE_ENV === "production") {
        // TODO: integrate a real email provider here (e.g. nodemailer + SMTP).
        // For now, production still logs the code so the app remains usable.
        console.log(`[OTP] (production) OTP for ${email}: ${otp}`);
        return;
    }
    console.log(`\n[OTP] Verification code for ${email}: ${otp}\n`);
};