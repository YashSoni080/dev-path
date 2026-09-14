import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Simple password strength indicator
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(form.password);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password);
      // Account created — redirect to OTP verification
      if (data.requiresOtp) {
        navigate("/verify-otp", { state: { email: form.email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-ink mb-2">Join DevPath</h1>
      <p className="text-ink/60 mb-8">Create an account to contribute resources to the trail.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            maxLength={50}
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full rounded-lg border border-trail/20 bg-white/70 px-3 py-2 focus:outline-none focus:border-amber"
          />
        </div>
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
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
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
          {form.password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= strength ? strengthColors[strength] : "bg-trail/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-ink/40">{strengthLabels[strength]}</p>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-trail text-parchment py-2.5 font-medium hover:bg-trail-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{" "}
        <Link to="/login" className="text-amber font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
