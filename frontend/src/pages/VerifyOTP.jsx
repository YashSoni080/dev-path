import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const RESEND_COOLDOWN = 60; // seconds

const VerifyOTP = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Email is passed via navigation state from Register or Login
  const email = location.state?.email;

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate("/register", { replace: true });
  }, [email, navigate]);

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only allow digits
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    if (value && index === 5) {
      const otp = newDigits.join("");
      if (otp.length === 6) handleSubmit(otp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setDigits(newDigits);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
    if (pasted.length === 6) handleSubmit(pasted);
  };

  const handleSubmit = async (otpOverride) => {
    const otp = otpOverride || digits.join("");
    if (otp.length !== 6) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await verifyOtp(email, otp);
      setSuccess(data.message);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      // Clear digits on error
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError("");
    setSuccess("");
    try {
      await resendOtp(email);
      setCooldown(RESEND_COOLDOWN);
      setSuccess("A new code has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    }
  };

  if (!email) return null;

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-ink mb-2">Verify your email</h1>
      <p className="text-ink/60 mb-2">
        Enter the 6-digit code sent to <span className="font-medium text-ink">{email}</span>
      </p>
      <p className="text-sm text-ink/40 mb-8">
        Check your console for the code (SMTP not configured yet).
      </p>

      {/* OTP input row */}
      <div className="flex justify-center gap-3 mb-6">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            autoFocus={i === 0}
            className="w-12 h-14 text-center text-2xl font-mono font-semibold rounded-lg border border-trail/20 bg-white/70 focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/30 transition-colors"
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-700 text-center mb-4">{error}</p>}
      {success && <p className="text-sm text-trail font-medium text-center mb-4">{success}</p>}

      <button
        onClick={() => handleSubmit()}
        disabled={loading || digits.join("").length !== 6}
        className="w-full rounded-full bg-trail text-parchment py-2.5 font-medium hover:bg-trail-dark transition-colors disabled:opacity-50 mb-4"
      >
        {loading ? "Verifying…" : "Verify"}
      </button>

      <p className="text-center text-sm text-ink/50">
        Didn't receive a code?{" "}
        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className="font-medium disabled:opacity-50"
          style={{ color: cooldown > 0 ? undefined : "#C97A3D" }}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </p>

      <p className="mt-4 text-center text-sm text-ink/50">
        <Link to="/register" className="text-amber font-medium">
          ← Back to register
        </Link>
      </p>
    </div>
  );
};

export default VerifyOTP;