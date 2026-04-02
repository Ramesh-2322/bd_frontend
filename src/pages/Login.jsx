import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/bdms.js";
import { setAuth } from "../utils/auth.js";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await login(form);
      setAuth(response.token, response.user);
      navigate("/");
    } catch {
      setError("Invalid credentials or server unavailable.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-header">
          <div className="brand-mark large">BDMS</div>
          <h1>PulseGrid Console</h1>
          <p>Sign in to manage donor networks and critical supply.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          {error && <div className="alert error">{error}</div>}
          <button className="btn primary" type="submit">
            Sign In
          </button>
        </form>
        <div className="login-footer">
          <p>Default admin: admin@bdms.local / Admin@123</p>
        </div>
      </div>
    </div>
  );
}
