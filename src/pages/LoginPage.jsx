import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../store/authStore";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!formData.email) nextErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = "Enter a valid email";
    if (!formData.password) nextErrors.password = "Password is required";
    if (formData.password.length < 6) nextErrors.password = "Minimum 6 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const ok = await login(formData);
    if (ok) {
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    }
  };

  return (
    <main className="grid min-h-screen place-content-center bg-hero-glow px-4">
      <section className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-medical-900">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to access your donor dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="donor@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-medical-700">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="Enter your password"
            />
            {errors.password && <p className="mt-1 text-xs text-medical-700">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {loading && <LoadingSpinner text="Authenticating user" />}

        <p className="mt-4 text-center text-sm text-slate-600">
          New donor?{" "}
          <Link to="/register" className="font-semibold text-medical-700 hover:underline">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
