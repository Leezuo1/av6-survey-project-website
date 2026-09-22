import { orderOptions } from "./optionOrder";

export interface OptionCount {
  label: string;
  count: number;
  pct: number;
}

export function aggregateQuestion(
  rows: Record<string, string>[],
  header: string
): OptionCount[] {
  const values = rows.map((r) => r[header]).filter((v) => v && v.length > 0);
  const total = values.length;

  const counts = new Map<string, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }

  const { labels: scaleLabels, isScale } = orderOptions(values);

  const labels = isScale
    ? scaleLabels
    : Array.from(counts.keys()).sort(
        (a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0)
      );

  return labels.map((label) => {
    const count = counts.get(label) ?? 0;
    return { label, count, pct: total > 0 ? (count / total) * 100 : 0 };
  });
}
