import { useEffect } from "react";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSaasStore } from "../store/saasStore";

function AuditLogsPage() {
  const auditLogs = useSaasStore((state) => state.auditLogs);
  const loading = useSaasStore((state) => state.loading);
  const error = useSaasStore((state) => state.error);
  const fetchAuditLogs = useSaasStore((state) => state.fetchAuditLogs);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-2xl font-bold text-medical-900">Audit Logs</h1>
        <p className="text-sm text-slate-600">Track platform events and user actions for compliance.</p>
      </section>

      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <section className="card mt-6 overflow-x-auto">
        {loading ? (
          <LoadingSpinner text="Loading audit logs" />
        ) : auditLogs.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No audit logs" description="System events will appear here once activity starts." />
          </div>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-medical-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-100">
              {auditLogs.map((log) => (
                <tr key={log.id || `${log.action}-${log.timestamp}`}>
                  <td className="px-6 py-4 font-semibold text-slate-800">{log.action || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-600">{log.user || log.userEmail || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default AuditLogsPage;
