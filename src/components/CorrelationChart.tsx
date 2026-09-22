import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GroupScore } from "../lib/correlation";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: GroupScore }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{d.group}</div>
      <div className="chart-tooltip-value">
        avg {d.avg.toFixed(2)} · n={d.n}
      </div>
    </div>
  );
}

export function CorrelationChart({ data }: { data: GroupScore[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 44)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 36, left: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} stroke="var(--gridline)" />
        <XAxis
          type="number"
          domain={[0, 5]}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          axisLine={{ stroke: "var(--baseline)" }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="group"
          width={140}
          tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          axisLine={{ stroke: "var(--baseline)" }}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "var(--hover-wash)" }}
        />
        <Bar dataKey="avg" radius={[0, 4, 4, 0]} maxBarSize={26} isAnimationActive={false}>
          {data.map((_, i) => (
            <Cell key={i} fill="var(--series-2)" />
          ))}
          <LabelList
            dataKey="avg"
            position="right"
            formatter={(v: unknown) => Number(v).toFixed(2)}
            style={{ fill: "var(--text-secondary)", fontSize: 12 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
