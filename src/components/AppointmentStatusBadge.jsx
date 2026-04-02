const statusStyles = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

function AppointmentStatusBadge({ status }) {
  const normalized = (status || "SCHEDULED").toUpperCase();
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

export default AppointmentStatusBadge;
