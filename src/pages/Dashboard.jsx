import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import DataTable from "../components/DataTable.jsx";
import { fetchAnalytics } from "../api/bdms.js";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics()
      .then(setSummary)
      .catch(() => setError("Unable to load analytics."));
  }, []);

  const inventoryRows = (summary?.inventory || []).map((item) => ({
    id: item.bloodGroup,
    group: item.bloodGroup,
    units: item.unitsAvailable,
    updated: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-",
  }));

  return (
    <div className="page">
      <SectionHeader
        title="Operations Dashboard"
        subtitle="Real-time monitoring of donors, stock, and requests."
      />
      {error && <div className="alert error">{error}</div>}
      <div className="stats-grid">
        <StatCard title="Total Donors" value={summary?.totalDonors ?? "-"} />
        <StatCard title="Total Donations" value={summary?.totalDonations ?? "-"} />
        <StatCard title="Active Requests" value={summary?.openRequests ?? "-"} />
        <StatCard title="Appointments" value={summary?.totalAppointments ?? "-"} />
      </div>
      <div className="grid two">
        <div className="panel">
          <h3>Inventory Snapshot</h3>
          <DataTable
            columns={[
              { key: "group", label: "Blood Group" },
              { key: "units", label: "Units" },
              { key: "updated", label: "Last Updated" },
            ]}
            rows={inventoryRows}
          />
        </div>
        <div className="panel">
          <h3>Critical Response Guide</h3>
          <div className="card-stack">
            <div className="card">
              <h4>Rapid Match</h4>
              <p>Use donor matching to shortlist eligible donors in seconds.</p>
            </div>
            <div className="card">
              <h4>Inventory Safety</h4>
              <p>Auto-deduct units once a request is fulfilled.</p>
            </div>
            <div className="card">
              <h4>Notifications</h4>
              <p>Alert staff and admins the moment a critical request lands.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
