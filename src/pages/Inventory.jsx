import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import { adjustInventory, fetchInventory } from "../api/bdms.js";

const bloodGroups = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ bloodGroup: "A_POS", unitsDelta: 1, reason: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    fetchInventory()
      .then(setInventory)
      .catch(() => setError("Unable to load inventory."));
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
      await adjustInventory({
        ...form,
        unitsDelta: Number(form.unitsDelta),
      });
      setSuccess("Inventory updated.");
      setForm({ bloodGroup: "A_POS", unitsDelta: 1, reason: "" });
      load();
    } catch {
      setError("Failed to adjust inventory.");
    }
  };

  const rows = inventory.map((item) => ({
    id: item.bloodGroup,
    group: item.bloodGroup,
    units: item.unitsAvailable,
    updated: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-",
  }));

  return (
    <div className="page">
      <SectionHeader title="Inventory Control" subtitle="Adjust stock levels and monitor blood availability." />
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="grid two">
        <div className="panel">
          <h3>Current Stock</h3>
          <DataTable
            columns={[
              { key: "group", label: "Blood Group" },
              { key: "units", label: "Units" },
              { key: "updated", label: "Last Updated" },
            ]}
            rows={rows}
          />
        </div>
        <div className="panel">
          <h3>Adjust Inventory</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group.replace("_", "+").replace("NEG", "-").replace("POS", "+")}
                </option>
              ))}
            </select>
            <input
              name="unitsDelta"
              type="number"
              value={form.unitsDelta}
              onChange={handleChange}
              placeholder="Units delta"
            />
            <input
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Reason"
            />
            <button className="btn primary" type="submit">
              Update Stock
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
