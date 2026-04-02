import { useEffect } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import RequestDetailsModal from "../components/RequestDetailsModal";
import SkeletonCard from "../components/SkeletonCard";
import StatusBadge from "../components/StatusBadge";
import { useRequestStore } from "../store/requestStore";

function MyRequestsPage() {
  const requests = useRequestStore((state) => state.requests);
  const loading = useRequestStore((state) => state.loading);
  const error = useRequestStore((state) => state.error);
  const modalOpen = useRequestStore((state) => state.modalOpen);
  const selectedRequest = useRequestStore((state) => state.selectedRequest);
  const fetchMyRequests = useRequestStore((state) => state.fetchMyRequests);
  const setModalOpen = useRequestStore((state) => state.setModalOpen);
  const setSelectedRequest = useRequestStore((state) => state.setSelectedRequest);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const openDetails = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-medical-900">My Blood Requests</h1>
          <p className="text-sm text-slate-600">Track your submitted requests and current status.</p>
        </div>
        <Link to="/requests/create" className="btn-primary">
          New Request
        </Link>
      </section>

      <section className="card mt-6 overflow-hidden">
        {error && (
          <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        {loading ? (
          <div className="grid gap-3 p-4">
            <SkeletonCard className="h-20" />
            <SkeletonCard className="h-20" />
            <SkeletonCard className="h-20" />
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-6 bg-medical-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <p>Patient</p>
              <p>Blood Group</p>
              <p>Units</p>
              <p>Hospital</p>
              <p>Status</p>
              <p>Actions</p>
            </div>

            <div className="divide-y divide-medical-100">
              {requests.length === 0 && (
                <div className="p-6">
                  <EmptyState
                    title="No blood requests"
                    description="Create your first blood request to start donor matching."
                  />
                </div>
              )}

              {requests.map((request) => (
                <article key={request.id} className="grid gap-3 px-6 py-4 md:grid-cols-6 md:items-center">
                  <p className="font-semibold text-slate-800">{request.patientName || "N/A"}</p>
                  <p className="text-sm text-slate-600">{request.bloodGroup || "N/A"}</p>
                  <p className="text-sm text-slate-600">{request.unitsRequired || 0}</p>
                  <p className="text-sm text-slate-600">{request.hospitalName || "N/A"}</p>
                  <div>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openDetails(request)}
                      className="rounded-lg border border-medical-200 px-3 py-1.5 text-xs font-semibold text-medical-700 hover:bg-medical-50"
                    >
                      View
                    </button>
                    <Link
                      to={`/requests/${request.id}/matches`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Matches
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
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

export default MyRequestsPage;
