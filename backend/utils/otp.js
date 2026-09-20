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
 * Send the OTP to the user via Resend transactional email API.
 * If running in Resend sandbox mode or using an unverified temp-mail address,
 * it returns a graceful fallback so verification is never blocked.
 */
export const sendOtpEmail = async (email, otp) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM || "DevPath <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`[OTP] (No RESEND_API_KEY) Verification code for ${email}: ${otp}`);
    return { success: true, deliveryMethod: "console" };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DevPath Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e4e4e7;">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1c1917; padding: 32px 30px; text-align: center;">
                    <div style="display: inline-block; background-color: #f59e0b; color: #1c1917; font-weight: 800; font-size: 20px; padding: 8px 18px; border-radius: 12px; letter-spacing: 1px;">
                      DEVPATH
                    </div>
                    <h1 style="color: #ffffff; font-size: 20px; margin: 18px 0 0 0; font-weight: 600; letter-spacing: -0.5px;">
                      Email Verification Code
                    </h1>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <p style="font-size: 15px; line-height: 24px; color: #3f3f46; margin: 0 0 20px 0;">
                      Hello,
                    </p>
                    <p style="font-size: 15px; line-height: 24px; color: #3f3f46; margin: 0 0 28px 0;">
                      Thank you for joining <strong>DevPath</strong>. Please use the 6-digit verification code below to confirm your email and activate your account:
                    </p>

                    <!-- Code Box -->
                    <div style="background-color: #fef3c7; border: 2px dashed #f59e0b; border-radius: 14px; padding: 22px; text-align: center; margin-bottom: 28px;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #78350f; display: inline-block;">
                        ${otp}
                      </span>
                    </div>

                    <p style="font-size: 13px; line-height: 20px; color: #71717a; margin: 0 0 12px 0;">
                      ⏱ This code is valid for <strong>10 minutes</strong> and can only be used once.
                    </p>
                    <p style="font-size: 13px; line-height: 20px; color: #71717a; margin: 0;">
                      If you did not register for DevPath, please ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 20px 30px; border-top: 1px solid #f4f4f5; text-align: center;">
                    <p style="font-size: 12px; color: #a1a1aa; margin: 0;">
                      © ${new Date().getFullYear()} DevPath. Curated learning roadmaps for developers.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: `Your DevPath Verification Code: ${otp}`,
        html: htmlContent,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`[Resend] Successfully sent OTP email to ${email} (ID: ${data.id})`);
      return { success: true, deliveryMethod: "resend", id: data.id };
    }

    // Handle Resend testing restriction (e.g. temp-mails / unverified domains)
    const isSandboxRestriction =
      data?.statusCode === 403 ||
      data?.name === "validation_error" ||
      data?.message?.includes("testing emails to your own email address");

    if (isSandboxRestriction) {
      console.warn(
        `[Resend Sandbox] Recipient ${email} is not the account owner. Fallback active for temp-mail testing. Code: ${otp}`
      );
      return {
        success: false,
        deliveryMethod: "sandbox_fallback",
        reason: "resend_sandbox_restriction",
        message: data.message,
      };
    }

    console.error(`[Resend Error] Failed to send email to ${email}:`, data);
    return {
      success: false,
      deliveryMethod: "error",
      error: data.message || "Email send failed",
    };
  } catch (error) {
    console.error(`[Resend Network Error] Failed to reach Resend API:`, error);
    return {
      success: false,
      deliveryMethod: "error",
      error: error.message,
    };
  }
};