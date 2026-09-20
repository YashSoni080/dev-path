import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { LogIn, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(form.email, form.password);

      if (data.requiresOtp) {
        navigate("/verify-otp", {
          state: { email: data.email || form.email, debugOtp: data.debugOtp },
        });
        return;
      }

      success(`Welcome back, ${data.user?.name || "Explorer"}!`);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please check credentials.";
      if (err.response?.status === 403 && err.response?.data?.requiresOtp) {
        navigate("/verify-otp", {
          state: { email: form.email, debugOtp: err.response?.data?.debugOtp },
        });
        return;
      }
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="rounded-3xl border border-trail/15 bg-white/90 backdrop-blur-md p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-trail text-parchment flex items-center justify-center mx-auto mb-3 shadow-md">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-ink/60 mt-1">
            Log in to save roadmap progress and contribute resources.
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
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
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
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-full bg-trail text-parchment py-3 font-semibold text-sm hover:bg-trail-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Logging in…</span>
            ) : (
              <>
                <span>Sign in to DevPath</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-trail/10 text-center text-xs text-ink/60">
          <span>New to DevPath? </span>
          <Link to="/register" className="text-amber font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
