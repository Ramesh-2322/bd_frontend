import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import { createDonation, fetchDonations } from "../api/bdms.js";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({
    donorId: "",
    donationDate: "",
    quantityMl: 350,
    center: "",
    status: "COMPLETED",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    fetchDonations()
      .then(setDonations)
      .catch(() => setError("Unable to load donations."));
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
      await createDonation({
        ...form,
        donorId: Number(form.donorId),
        quantityMl: Number(form.quantityMl),
      });
      setSuccess("Donation recorded.");
      setForm({ donorId: "", donationDate: "", quantityMl: 350, center: "", status: "COMPLETED", notes: "" });
      load();
    } catch {
      setError("Failed to record donation.");
    }
  };

  const rows = donations.map((donation) => ({
    id: donation.id,
    donor: donation.donorName,
    date: donation.donationDate,
    quantity: donation.quantityMl,
    center: donation.center || "-",
  }));

  return (
    <div className="page">
      <SectionHeader title="Donations" subtitle="Track every donation entry and its impact." />
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="grid two">
        <div className="panel">
          <h3>Donation Log</h3>
          <DataTable
            columns={[
              { key: "donor", label: "Donor" },
              { key: "date", label: "Date" },
              { key: "quantity", label: "ML" },
              { key: "center", label: "Center" },
            ]}
            rows={rows}
          />
        </div>
        <div className="panel">
          <h3>Record Donation</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input name="donorId" value={form.donorId} onChange={handleChange} placeholder="Donor ID" required />
            <input name="donationDate" type="date" value={form.donationDate} onChange={handleChange} required />
            <input
              name="quantityMl"
              type="number"
              value={form.quantityMl}
              onChange={handleChange}
              min="100"
              placeholder="Quantity (ml)"
            />
            <input name="center" value={form.center} onChange={handleChange} placeholder="Center" />
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="COMPLETED">COMPLETED</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" />
            <button className="btn primary" type="submit">
              Save Donation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
