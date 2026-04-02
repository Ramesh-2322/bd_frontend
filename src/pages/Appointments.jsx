import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import { createAppointment, fetchAppointments } from "../api/bdms.js";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ donorId: "", scheduledAt: "", location: "", notes: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    fetchAppointments()
      .then(setAppointments)
      .catch(() => setError("Unable to load appointments."));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createAppointment({
        ...form,
        donorId: Number(form.donorId),
      });
      setSuccess("Appointment scheduled.");
      setForm({ donorId: "", scheduledAt: "", location: "", notes: "" });
      load();
    } catch {
      setError("Failed to create appointment.");
    }
  };

  const rows = appointments.map((appt) => ({
    id: appt.id,
    donor: appt.donorName,
    scheduled: new Date(appt.scheduledAt).toLocaleString(),
    location: appt.location,
    status: appt.status,
  }));

  return (
    <div className="page">
      <SectionHeader title="Appointments" subtitle="Schedule donation slots and manage turnout." />
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="grid two">
        <div className="panel">
          <h3>Upcoming Appointments</h3>
          <DataTable
            columns={[
              { key: "donor", label: "Donor" },
              { key: "scheduled", label: "Scheduled" },
              { key: "location", label: "Location" },
              { key: "status", label: "Status" },
            ]}
            rows={rows}
          />
        </div>
        <div className="panel">
          <h3>Create Appointment</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input
              name="donorId"
              value={form.donorId}
              onChange={handleChange}
              placeholder="Donor ID"
              required
            />
            <input
              name="scheduledAt"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={handleChange}
              required
            />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
            <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" />
            <button className="btn primary" type="submit">
              Schedule
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
