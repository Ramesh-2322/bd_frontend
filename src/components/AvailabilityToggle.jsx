function AvailabilityToggle({ available, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!available)}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
        available ? "bg-medical-700" : "bg-slate-300"
      }`}
      aria-label="Toggle availability"
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
          available ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default AvailabilityToggle;
