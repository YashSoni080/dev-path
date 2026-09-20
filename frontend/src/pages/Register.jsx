import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { UserPlus, Eye, EyeOff, Mail, Lock, User, Check, ArrowRight } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Password rules validation
  const rules = {
    length: form.password.length >= 6,
    hasNumber: /[0-9]/.test(form.password),
    hasUpper: /[A-Z]/.test(form.password),
    hasSpecial: /[^A-Za-z0-9]/.test(form.password),
  };

  const strengthScore = Object.values(rules).filter(Boolean).length;
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-rose-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password);
      success("Account created! Check your verification code.");

      if (data.requiresOtp) {
        navigate("/verify-otp", {
          state: { email: form.email, debugOtp: data.debugOtp },
        });
      } else {
        navigate("/login");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="rounded-3xl border border-trail/15 bg-white/90 backdrop-blur-md p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber text-trail-dark flex items-center justify-center mx-auto mb-3 shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            Join the Trail
          </h1>
          <p className="text-xs sm:text-sm text-ink/60 mt-1">
            Track your roadmap progress and discover curated free resources.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-mono uppercase tracking-wider text-ink/70 font-semibold mb-1.5"
            >
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-ink/40 absolute left-3.5 pointer-events-none" />
              <input
                id="name"
                type="text"
                name="name"
                required
                maxLength={50}
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ada Lovelace"
                className="w-full rounded-xl border border-trail/20 bg-white pl-10 pr-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono uppercase tracking-wider text-ink/70 font-semibold mb-1.5"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-ink/40 absolute left-3.5 pointer-events-none" />
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ada@example.com"
                className="w-full rounded-xl border border-trail/20 bg-white pl-10 pr-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono uppercase tracking-wider text-ink/70 font-semibold mb-1.5"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-ink/40 absolute left-3.5 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-trail/20 bg-white pl-10 pr-10 py-2.5 text-sm text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-ink/40 hover:text-ink/70 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password strength meter */}
            {form.password.length > 0 && (
              <div className="mt-2.5 p-3 rounded-xl bg-parchment/60 border border-trail/10 text-xs space-y-1.5">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= strengthScore
                          ? strengthColors[strengthScore - 1] || "bg-rose-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] text-ink/60">
                  <span className={`flex items-center gap-1 ${rules.length ? "text-emerald-700 font-medium" : ""}`}>
                    <Check className={`w-3 h-3 ${rules.length ? "opacity-100" : "opacity-30"}`} />
                    6+ characters
                  </span>
                  <span className={`flex items-center gap-1 ${rules.hasNumber ? "text-emerald-700 font-medium" : ""}`}>
                    <Check className={`w-3 h-3 ${rules.hasNumber ? "opacity-100" : "opacity-30"}`} />
                    1+ number
                  </span>
                  <span className={`flex items-center gap-1 ${rules.hasUpper ? "text-emerald-700 font-medium" : ""}`}>
                    <Check className={`w-3 h-3 ${rules.hasUpper ? "opacity-100" : "opacity-30"}`} />
                    Uppercase letter
                  </span>
                  <span className={`flex items-center gap-1 ${rules.hasSpecial ? "text-emerald-700 font-medium" : ""}`}>
                    <Check className={`w-3 h-3 ${rules.hasSpecial ? "opacity-100" : "opacity-30"}`} />
                    Special character
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-full bg-amber text-trail-dark py-3 font-semibold text-sm hover:bg-amber/90 transition-all shadow-md shadow-amber/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Creating Account…</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-trail/10 text-center text-xs text-ink/60">
          <span>Already registered? </span>
          <Link to="/login" className="text-amber font-semibold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
