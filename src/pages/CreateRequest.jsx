import { useState } from "react";
import toast from "react-hot-toast";
import { bdmsService } from "../services/bdmsService";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function CreateRequest() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    unitsRequired: "",
    hospital: "",
    location: "",
    contactNumber: "",
  });

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      bloodGroup: "",
      unitsRequired: "",
      hospital: "",
      location: "",
      contactNumber: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await bdmsService.createRequest({
        ...formData,
        unitsRequired: Number(formData.unitsRequired),
      });
      toast.success("Request created successfully");
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-medical-800 dark:text-medical-300">Create Request</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Fill in patient and hospital details.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Patient Name">
            <input
              required
              className="input"
              value={formData.patientName}
              onChange={updateField("patientName")}
              placeholder="Enter patient name"
            />
          </Field>

          <Field label="Blood Group">
            <select required className="input" value={formData.bloodGroup} onChange={updateField("bloodGroup")}>
              <option value="">Select blood group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Units Required">
            <input
              required
              min="1"
              type="number"
              className="input"
              value={formData.unitsRequired}
              onChange={updateField("unitsRequired")}
              placeholder="Enter units required"
            />
          </Field>

          <Field label="Hospital">
            <input
              required
              className="input"
              value={formData.hospital}
              onChange={updateField("hospital")}
              placeholder="Enter hospital"
            />
          </Field>

          <Field label="Location">
            <input
              required
              className="input"
              value={formData.location}
              onChange={updateField("location")}
              placeholder="Enter location"
            />
          </Field>

          <Field label="Contact Number">
            <input
              required
              className="input"
              value={formData.contactNumber}
              onChange={updateField("contactNumber")}
              placeholder="Enter contact number"
            />
          </Field>

          <div className="md:col-span-2">
            <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto">
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      {children}
    </div>
  );
}

export default CreateRequest;
