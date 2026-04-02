function EmptyState({ title, description }) {
  return (
    <div className="card px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default EmptyState;
