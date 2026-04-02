import { useEffect } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import RequestDetailsModal from "../components/RequestDetailsModal";
import StatusBadge from "../components/StatusBadge";
import { useRequestStore } from "../store/requestStore";

function AdminRequestsPage() {
  const requests = useRequestStore((state) => state.requests);
  const loading = useRequestStore((state) => state.loading);
  const error = useRequestStore((state) => state.error);
  const submitting = useRequestStore((state) => state.submitting);
  const modalOpen = useRequestStore((state) => state.modalOpen);
  const selectedRequest = useRequestStore((state) => state.selectedRequest);
  const fetchAllRequests = useRequestStore((state) => state.fetchAllRequests);
  const updateRequestStatus = useRequestStore((state) => state.updateRequestStatus);
  const setModalOpen = useRequestStore((state) => state.setModalOpen);
  const setSelectedRequest = useRequestStore((state) => state.setSelectedRequest);

  useEffect(() => {
    fetchAllRequests();
  }, [fetchAllRequests]);

  const openDetails = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-2xl font-bold text-medical-900">Admin Requests Dashboard</h1>
        <p className="text-sm text-slate-600">Review and process all blood requests.</p>
      </section>

      <section className="card mt-6 overflow-x-auto">
        {error && (
          <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        {loading ? (
          <LoadingSpinner text="Loading all requests" />
        ) : (
          <table className="min-w-[920px] w-full text-left">
            <thead className="bg-medical-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Group</th>
                <th className="px-6 py-3">Units</th>
                <th className="px-6 py-3">Hospital</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-100 text-sm">
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    <EmptyState
                      title="No requests available"
                      description="Incoming blood requests will appear here for admin action."
                    />
                  </td>
                </tr>
              )}

              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 font-semibold text-slate-800">{request.patientName || "N/A"}</td>
                  <td className="px-6 py-4">{request.bloodGroup || "N/A"}</td>
                  <td className="px-6 py-4">{request.unitsRequired || 0}</td>
                  <td className="px-6 py-4">{request.hospitalName || "N/A"}</td>
                  <td className="px-6 py-4">{request.location || "N/A"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => updateRequestStatus(request.id, "APPROVED")}
                        className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => updateRequestStatus(request.id, "REJECTED")}
                        className="rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200 disabled:opacity-60"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => updateRequestStatus(request.id, "COMPLETED")}
                        className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200 disabled:opacity-60"
                      >
                        Complete
                      </button>
                      <button
                        type="button"
                        onClick={() => openDetails(request)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Details
                      </button>
                      <Link
                        to={`/requests/${request.id}/matches`}
                        className="rounded-lg border border-medical-200 px-2.5 py-1 text-xs font-semibold text-medical-700 hover:bg-medical-50"
                      >
                        Matches
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <RequestDetailsModal
        open={modalOpen}
        request={selectedRequest}
        onClose={() => {
          setModalOpen(false);
          setSelectedRequest(null);
        }}
      />
    </main>
  );
}

export default AdminRequestsPage;
