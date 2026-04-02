import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import { fetchAuditLogs } from "../api/bdms.js";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuditLogs()
      .then(setLogs)
      .catch(() => setError("Unable to load audit logs."));
  }, []);

  const rows = logs.map((log) => ({
    id: log.id,
    actor: log.actor?.name || "System",
    action: log.action,
    entity: log.entityType,
    created: new Date(log.createdAt).toLocaleString(),
  }));

  return (
    <div className="page">
      <SectionHeader title="Audit Logs" subtitle="Track administrative and system actions." />
      {error && <div className="alert error">{error}</div>}
      <div className="panel">
        <DataTable
          columns={[
            { key: "actor", label: "Actor" },
            { key: "action", label: "Action" },
            { key: "entity", label: "Entity" },
            { key: "created", label: "Timestamp" },
          ]}
          rows={rows}
        />
      </div>
    </div>
  );
}
