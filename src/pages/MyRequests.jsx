import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import StatusBadge from "../components/StatusBadge";
import { bdmsService } from "../services/bdmsService";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const data = await bdmsService.getRequests();
        setRequests(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const tableRows = useMemo(() => {
    return requests.map((item) => ({
      id: item.id || item.requestId,
      patientName: item.patientName || "N/A",
      bloodGroup: item.bloodGroup || "N/A",
      location: item.location || item.city || "N/A",
      status: item.status || "PENDING",
      source: item,
    }));
  }, [requests]);

  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-medical-800 dark:text-medical-300">My Requests</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          View and track your blood requests in one place.
        </p>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-medical-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Patient Name</th>
                <th className="px-4 py-3 font-semibold">Blood Group</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-100 dark:divide-slate-800">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Loading requests...
                  </td>
                </tr>
              )}

              {!loading && tableRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No requests found.
                  </td>
                </tr>
              )}

              {!loading &&
                tableRows.map((row) => (
                  <tr key={row.id || `${row.patientName}-${row.location}`}>
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-100">{row.patientName}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.bloodGroup}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.location}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(row.source)}
                        className="rounded-lg border border-medical-200 px-3 py-1.5 text-xs font-semibold text-medical-700 hover:bg-medical-50 dark:border-slate-700 dark:text-medical-300 dark:hover:bg-slate-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 px-4" role="dialog" aria-modal="true">
          <div className="card w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-medical-800 dark:text-medical-300">Request Details</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <p>
                <span className="font-semibold">Patient:</span> {selectedRequest.patientName || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Blood Group:</span> {selectedRequest.bloodGroup || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Units Required:</span> {selectedRequest.unitsRequired || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Hospital:</span> {selectedRequest.hospital || selectedRequest.hospitalName || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {selectedRequest.location || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Contact:</span> {selectedRequest.contactNumber || "N/A"}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" className="btn-secondary" onClick={() => setSelectedRequest(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyRequests;
