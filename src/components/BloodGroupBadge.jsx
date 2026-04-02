function BloodGroupBadge({ group }) {
  return (
    <span className="inline-flex items-center rounded-full bg-medical-100 px-3 py-1 text-sm font-semibold text-medical-800">
      {group || "N/A"}
    </span>
  );
}

export default BloodGroupBadge;
