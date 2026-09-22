interface Props {
  label: string;
  value: string;
  sub?: string;
  accent: 1 | 2 | 3 | 4;
}

export function KpiCard({ label, value, sub, accent }: Props) {
  return (
    <div className={`kpi-card accent-${accent}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}
