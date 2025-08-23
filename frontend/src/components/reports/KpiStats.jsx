const KpiStats = ({ title, value, format = "text" }) => (
  <div className="stat bg-base-100 place-content-center gap-1">
    <div className="stat-title text-md">{title}</div>
    <div className="stat-value text-primary text-2xl">
      {format === "currency" ? `$${value.toLocaleString()}` : value}
    </div>
  </div>
);

export default KpiStats;
