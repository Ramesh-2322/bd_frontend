const statusStyles = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

function StatusBadge({ status }) {
  const normalized = (status || "PENDING").toUpperCase();

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[normalized] || "bg-slate-100 text-slate-600"
      }`}
    >
      {normalized}
    </span>
  );
}

export default StatusBadge;
