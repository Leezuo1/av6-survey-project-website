import { orderOptions } from "./optionOrder";

export interface OrdinalScore {
  avg: number;
  max: number;
  scaleLow: string;
  scaleHigh: string;
  n: number;
}

export function averageOrdinalScore(
  rows: Record<string, string>[],
  header: string
): OrdinalScore | null {
  const values = rows.map((r) => r[header]).filter((v) => v && v.length > 0);
  if (values.length === 0) return null;

  const { labels, isScale } = orderOptions(values);
  if (!isScale || labels.length < 2) return null;

  const rank = new Map(labels.map((l, i) => [l.toLowerCase(), i + 1]));
  const scored = values
    .map((v) => rank.get(v.toLowerCase()))
    .filter((v): v is number => v !== undefined);
  if (scored.length === 0) return null;

  const avg = scored.reduce((a, b) => a + b, 0) / scored.length;
  return {
    avg,
    max: labels.length,
    scaleLow: labels[0],
    scaleHigh: labels[labels.length - 1],
    n: scored.length,
  };
}
