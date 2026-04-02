import StatusBadge from "./StatusBadge";

function RequestDetailsModal({ open, onClose, request }) {
  if (!open || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="card w-full max-w-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-medical-900">Request Details</h2>
            <p className="text-sm text-slate-500">Reference: #{request.id || "N/A"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Detail label="Patient" value={request.patientName} />
          <Detail label="Blood Group" value={request.bloodGroup} />
          <Detail label="Units Required" value={request.unitsRequired} />
          <Detail label="Hospital" value={request.hospitalName} />
          <Detail label="Location" value={request.location} />
          <Detail label="Urgency" value={request.urgencyLevel} />
        </div>

        <div className="mt-4">
          <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">Current Status</p>
          <StatusBadge status={request.status} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl border border-medical-100 bg-medical-50 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value || "N/A"}</p>
    </div>
  );
}

export default RequestDetailsModal;
