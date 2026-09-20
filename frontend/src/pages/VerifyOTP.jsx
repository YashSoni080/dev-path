import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { KeyRound, ArrowRight, ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

const RESEND_COOLDOWN = 60; // seconds

const VerifyOTP = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const [debugOtp, setDebugOtp] = useState(location.state?.debugOtp || null);

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleDigitChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue && value !== "") return;

    const char = cleanValue.slice(-1); // Take last char if multiple entered
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all filled
    if (char && index === 5) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 6) {
        submitCode(fullCode);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setDigits(newDigits);

    const targetIdx = Math.min(pasted.length, 5);
    inputRefs.current[targetIdx]?.focus();

    if (pasted.length === 6) {
      submitCode(pasted);
    }
  };

  const submitCode = async (codeToVerify) => {
    const code = codeToVerify || digits.join("");
    if (code.length !== 6) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await verifyOtp(email, code);
      setSuccess("Email verified successfully! Welcome to DevPath.");
      toastSuccess("Account verified! Redirecting to trail…");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired code.";
      setError(msg);
      toastError(msg);
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
      const data = await resendOtp(email);
      setCooldown(RESEND_COOLDOWN);
      if (data.debugOtp) setDebugOtp(data.debugOtp);
      toastSuccess("A new verification code has been sent!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend code.";
      setError(msg);
      toastError(msg);
    }
  };

  const handleFillDebugCode = () => {
    if (!debugOtp) return;
    const splitCode = debugOtp.split("").slice(0, 6);
    setDigits(splitCode);
    submitCode(debugOtp);
  };

  if (!email) return null;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="rounded-3xl border border-trail/15 bg-white/90 backdrop-blur-md p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber text-trail-dark flex items-center justify-center mx-auto mb-3 shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            Verify Your Email
          </h1>
          <p className="text-xs sm:text-sm text-ink/60 mt-1">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-ink">{email}</span>
          </p>
        </div>

        {/* Development Helper Pill */}
        {debugOtp && (
          <div className="mb-5 p-3 rounded-2xl bg-amber/10 border border-amber/30 text-ink text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber shrink-0" />
              <span>
                Dev Code: <strong className="font-mono text-sm tracking-wider">{debugOtp}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDebugCode}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber text-trail-dark hover:bg-amber/90 transition-colors shadow-xs shrink-0"
            >
              Auto-fill & verify
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        {/* 6-Digit PIN Inputs */}
        <div className="flex justify-center gap-2 sm:gap-2.5 mb-6">
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
              aria-label={`Digit ${i + 1}`}
              className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border border-trail/20 bg-white text-ink shadow-xs focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/30 transition-all"
            />
          ))}
        </div>

        <button
          onClick={() => submitCode()}
          disabled={loading || digits.join("").length !== 6}
          className="w-full rounded-full bg-trail text-parchment py-3 font-semibold text-sm hover:bg-trail-dark transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Verifying Code…</span>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Resend Cooldown */}
        <div className="mt-6 pt-5 border-t border-trail/10 text-center text-xs text-ink/60 flex items-center justify-center gap-1.5">
          <span>Didn't receive code?</span>
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="font-semibold text-amber hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code now"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-1 text-xs text-ink/50 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to registration</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;