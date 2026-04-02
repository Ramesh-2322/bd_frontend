import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../store/authStore";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "DONOR",
    bloodGroup: "",
    location: "",
    phone: "",
    hospitalId: "",
    hospitalName: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = "Valid email required";
    if (formData.password.length < 8) nextErrors.password = "Password must be at least 8 characters";
    if (formData.role === "DONOR" && !formData.bloodGroup) nextErrors.bloodGroup = "Select blood group";
    if (!formData.location.trim()) nextErrors.location = "Location is required";
    if (!/^\d{10,15}$/.test(formData.phone)) nextErrors.phone = "Phone must be 10-15 digits";
    if (formData.role === "HOSPITAL" && !formData.hospitalName.trim()) {
      nextErrors.hospitalName = "Hospital name is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const defaultHospitalId = import.meta.env.VITE_DEFAULT_HOSPITAL_ID;

    const payload = {
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      bloodGroup: formData.role === "DONOR" ? formData.bloodGroup : undefined,
      location: formData.location.trim(),
      phoneNumber: formData.phone.trim(),
      availabilityStatus: formData.role === "DONOR",
      role: formData.role,
      hospitalName: formData.hospitalName?.trim() || undefined,
      ...(formData.hospitalId
        ? { hospitalId: Number(formData.hospitalId) }
        : defaultHospitalId
          ? { hospitalId: Number(defaultHospitalId) }
          : {}),
    };

    const ok = await register(payload);
    if (ok) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <main className="grid min-h-screen place-content-center bg-hero-glow px-4 py-8">
      <section className="card w-full max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-medical-900">Create BDMS Account</h1>
        <p className="mt-2 text-sm text-slate-600">Register as donor, admin, or hospital staff.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              className="input"
              value={formData.fullName}
              onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="John Doe"
            />
            {errors.fullName && <p className="mt-1 text-xs text-medical-700">{errors.fullName}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            />
            {errors.email && <p className="mt-1 text-xs text-medical-700">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
            />
            {errors.password && <p className="mt-1 text-xs text-medical-700">{errors.password}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <select
              className="input"
              value={formData.role}
              onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value }))}
            >
              <option value="DONOR">Donor</option>
              <option value="ADMIN">Admin</option>
              <option value="HOSPITAL">Hospital</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Blood Group</label>
            <select
              className="input"
              value={formData.bloodGroup}
              disabled={formData.role !== "DONOR"}
              onChange={(event) => setFormData((prev) => ({ ...prev, bloodGroup: event.target.value }))}
            >
              <option value="">Select group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <p className="mt-1 text-xs text-medical-700">{errors.bloodGroup}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hospital ID (optional)</label>
            <input
              className="input"
              value={formData.hospitalId}
              onChange={(event) => setFormData((prev) => ({ ...prev, hospitalId: event.target.value }))}
              placeholder="e.g. 101"
            />
          </div>

          {formData.role === "HOSPITAL" && (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Hospital Name</label>
              <input
                className="input"
                value={formData.hospitalName}
                onChange={(event) => setFormData((prev) => ({ ...prev, hospitalName: event.target.value }))}
                placeholder="Enter hospital name"
              />
              {errors.hospitalName && <p className="mt-1 text-xs text-medical-700">{errors.hospitalName}</p>}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
            <input
              className="input"
              value={formData.location}
              onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
            />
            {errors.location && <p className="mt-1 text-xs text-medical-700">{errors.location}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <input
              className="input"
              value={formData.phone}
              onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="9876543210"
            />
            {errors.phone && <p className="mt-1 text-xs text-medical-700">{errors.phone}</p>}
          </div>

          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        {loading && <LoadingSpinner text="Creating account" />}

        <p className="mt-4 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-medical-700 hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
