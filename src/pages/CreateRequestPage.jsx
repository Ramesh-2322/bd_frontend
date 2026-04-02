import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestStore } from "../store/requestStore";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencies = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function CreateRequestPage() {
  const navigate = useNavigate();
  const createRequest = useRequestStore((state) => state.createRequest);
  const submitting = useRequestStore((state) => state.submitting);

  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    unitsRequired: "",
    hospitalName: "",
    location: "",
    urgencyLevel: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!formData.patientName.trim()) nextErrors.patientName = "Patient name is required";
    if (!formData.bloodGroup) nextErrors.bloodGroup = "Select blood group";
    if (!formData.unitsRequired || Number(formData.unitsRequired) <= 0)
      nextErrors.unitsRequired = "Units must be greater than 0";
    if (!formData.hospitalName.trim()) nextErrors.hospitalName = "Hospital name is required";
    if (!formData.location.trim()) nextErrors.location = "Location is required";
    if (!formData.urgencyLevel) nextErrors.urgencyLevel = "Select urgency level";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const ok = await createRequest({
      ...formData,
      unitsRequired: Number(formData.unitsRequired),
    });

    if (ok) {
      navigate("/requests/my");
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-medical-900">Create Blood Request</h1>
        <p className="mt-1 text-sm text-slate-600">Submit a new blood requirement for immediate matching.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
          <Field label="Patient Name" error={errors.patientName}>
            <input
              className="input"
              value={formData.patientName}
              onChange={(event) => setFormData((prev) => ({ ...prev, patientName: event.target.value }))}
              placeholder="Patient full name"
            />
          </Field>

          <Field label="Blood Group" error={errors.bloodGroup}>
            <select
              className="input"
              value={formData.bloodGroup}
              onChange={(event) => setFormData((prev) => ({ ...prev, bloodGroup: event.target.value }))}
            >
              <option value="">Select blood group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Units Required" error={errors.unitsRequired}>
            <input
              type="number"
              min="1"
              className="input"
              value={formData.unitsRequired}
              onChange={(event) => setFormData((prev) => ({ ...prev, unitsRequired: event.target.value }))}
              placeholder="2"
            />
          </Field>

          <Field label="Urgency Level" error={errors.urgencyLevel}>
            <select
              className="input"
              value={formData.urgencyLevel}
              onChange={(event) => setFormData((prev) => ({ ...prev, urgencyLevel: event.target.value }))}
            >
              <option value="">Select urgency</option>
              {urgencies.map((urgency) => (
                <option key={urgency} value={urgency}>
                  {urgency}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Hospital Name" error={errors.hospitalName}>
            <input
              className="input"
              value={formData.hospitalName}
              onChange={(event) => setFormData((prev) => ({ ...prev, hospitalName: event.target.value }))}
              placeholder="City Medical Center"
            />
          </Field>

          <Field label="Location" error={errors.location}>
            <input
              className="input"
              value={formData.location}
              onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
              placeholder="Chennai"
            />
          </Field>

          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Submitting request..." : "Submit Request"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-medical-700">{error}</p>}
    </div>
  );
}

export default CreateRequestPage;
