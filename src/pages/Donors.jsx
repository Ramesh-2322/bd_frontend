import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import { createDonor, fetchDonors } from "../api/bdms.js";

const bloodGroups = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    bloodGroup: "A_POS",
    gender: "Female",
    address: "",
    city: "",
    available: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    fetchDonors()
      .then(setDonors)
      .catch(() => setError("Unable to load donors."));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createDonor(form);
      setSuccess("Donor created successfully.");
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        bloodGroup: "A_POS",
        gender: "Female",
        address: "",
        city: "",
        available: true,
      });
      load();
    } catch {
      setError("Failed to create donor.");
    }
  };

  const rows = donors.map((donor) => ({
    id: donor.id,
    name: donor.name,
    bloodGroup: donor.bloodGroup,
    city: donor.city || "-",
    available: donor.available ? "Yes" : "No",
    total: donor.totalDonations,
  }));

  return (
    <div className="page">
      <SectionHeader title="Donor Management" subtitle="Register, track, and activate donors." />
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="grid two">
        <div className="panel">
          <h3>Donor Registry</h3>
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "bloodGroup", label: "Blood" },
              { key: "city", label: "City" },
              { key: "available", label: "Available" },
              { key: "total", label: "Donations" },
            ]}
            rows={rows}
          />
        </div>
        <div className="panel">
          <h3>Add New Donor</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Temporary password"
              required
            />
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group.replace("_", "+").replace("NEG", "-").replace("POS", "+")}
                </option>
              ))}
            </select>
            <input name="gender" value={form.gender} onChange={handleChange} placeholder="Gender" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
            <label className="checkbox">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
              />
              Available for donation
            </label>
            <button className="btn primary" type="submit">
              Create Donor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
