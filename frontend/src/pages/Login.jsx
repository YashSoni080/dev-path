import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.requiresOtp) {
        navigate("/verify-otp", { state: { email: data.email || form.email } });
        return;
      }
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      // If backend says to verify, redirect to OTP page
      if (err.response?.status === 403 && err.response?.data?.requiresOtp) {
        navigate("/verify-otp", { state: { email: form.email } });
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-ink mb-2">Welcome back</h1>
      <p className="text-ink/60 mb-8">Log in to add resources to the trail.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-trail/20 bg-white/70 px-3 py-2 focus:outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="w-full rounded-lg border border-trail/20 bg-white/70 px-3 py-2 pr-10 focus:outline-none focus:border-amber"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-trail text-parchment py-2.5 font-medium hover:bg-trail-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        New here?{" "}
        <Link to="/register" className="text-amber font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
