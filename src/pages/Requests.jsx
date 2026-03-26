import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import { createRequest, fetchRequests } from "../api/bdms.js";

const bloodGroups = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];
const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    requesterName: "",
    requesterContact: "",
    bloodGroup: "A_POS",
    unitsNeeded: 1,
    priority: "HIGH",
    hospital: "",
    neededBy: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    fetchRequests()
      .then(setRequests)
      .catch(() => setError("Unable to load requests."));
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
      await createRequest({
        ...form,
        unitsNeeded: Number(form.unitsNeeded),
        neededBy: form.neededBy || null,
      });
      setSuccess("Request created.");
      setForm({
        requesterName: "",
        requesterContact: "",
        bloodGroup: "A_POS",
        unitsNeeded: 1,
        priority: "HIGH",
        hospital: "",
        neededBy: "",
      });
      load();
    } catch {
      setError("Failed to create request.");
    }
  };

  const rows = requests.map((req) => ({
    id: req.id,
    requester: req.requesterName,
    blood: req.bloodGroup,
    units: req.unitsNeeded,
    priority: req.priority,
    status: req.status,
  }));

  return (
    <div className="page">
      <SectionHeader title="Blood Requests" subtitle="Manage urgent and scheduled requests." />
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="grid two">
        <div className="panel">
          <h3>Request Queue</h3>
          <DataTable
            columns={[
              { key: "requester", label: "Requester" },
              { key: "blood", label: "Blood" },
              { key: "units", label: "Units" },
              { key: "priority", label: "Priority" },
              { key: "status", label: "Status" },
            ]}
            rows={rows}
          />
        </div>
        <div className="panel">
          <h3>New Request</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input
              name="requesterName"
              value={form.requesterName}
              onChange={handleChange}
              placeholder="Requester name"
              required
            />
            <input
              name="requesterContact"
              value={form.requesterContact}
              onChange={handleChange}
              placeholder="Contact number"
              required
            />
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group.replace("_", "+").replace("NEG", "-").replace("POS", "+")}
                </option>
              ))}
            </select>
            <input
              name="unitsNeeded"
              type="number"
              value={form.unitsNeeded}
              onChange={handleChange}
              min="1"
              placeholder="Units needed"
            />
            <select name="priority" value={form.priority} onChange={handleChange}>
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              placeholder="Hospital"
            />
            <input name="neededBy" type="date" value={form.neededBy} onChange={handleChange} />
            <button className="btn primary" type="submit">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
