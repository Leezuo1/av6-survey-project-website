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
import type { OptionCount } from "../lib/aggregate";

interface Props {
  title: string;
  data: OptionCount[];
}

function truncate(s: string, max = 28) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: OptionCount }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{d.label}</div>
      <div className="chart-tooltip-value">
        {d.count} responses · {d.pct.toFixed(1)}%
      </div>
    </div>
  );
}

export function QuestionChart({ title, data }: Props) {
  const rowHeight = 34;
  const height = Math.max(120, data.length * rowHeight + 20);

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 28, left: 4, bottom: 4 }}
          barCategoryGap={8}
        >
          <CartesianGrid
            horizontal={false}
            stroke="var(--gridline)"
            strokeDasharray="0"
          />
          <XAxis
            type="number"
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--baseline)" }}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={150}
            tickFormatter={(v: string) => truncate(v)}
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={{ stroke: "var(--baseline)" }}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--hover-wash)" }}
          />
          <Bar
            dataKey="count"
            radius={[0, 4, 4, 0]}
            maxBarSize={22}
            isAnimationActive={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill="var(--series-1)" />
            ))}
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v: unknown) => `${Number(v).toFixed(0)}%`}
              style={{ fill: "var(--text-secondary)", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
