export default function StatCard({ title, value, trend, meta }) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <h3>{value}</h3>
        {meta && <span className="stat-meta">{meta}</span>}
      </div>
      {trend && <div className={`stat-trend ${trend.type}`}>{trend.label}</div>}
    </div>
  );
}
