import { orderOptions } from "./optionOrder";
import { averageOrdinalScore } from "./score";
import { ANSWER_ALLOWLIST } from "./aggregate";

export interface GroupScore {
  group: string;
  avg: number;
  n: number;
}

// Splits rows into buckets by `groupHeader` (e.g. hours spent, year of study)
// and computes the average ordinal score of `targetHeader` (e.g. an attitude
// question) within each bucket, so the two can be compared side by side.
export function scoreByGroup(
  rows: Record<string, string>[],
  groupHeader: string,
  groupIndex: number | undefined,
  targetHeader: string
): GroupScore[] {
  const allow =
    groupIndex !== undefined ? ANSWER_ALLOWLIST[groupIndex] : undefined;
  const allowSet = allow ? new Set(allow.map((a) => a.toLowerCase())) : null;

  const buckets = new Map<string, Record<string, string>[]>();
  for (const r of rows) {
    const g = r[groupHeader];
    if (!g) continue;
    if (allowSet && !allowSet.has(g.toLowerCase())) continue;
    if (!buckets.has(g)) buckets.set(g, []);
    buckets.get(g)!.push(r);
  }

  const { labels, isScale } = orderOptions(Array.from(buckets.keys()));
  const order = isScale
    ? labels
    : Array.from(buckets.keys()).sort(
        (a, b) => (buckets.get(b)?.length ?? 0) - (buckets.get(a)?.length ?? 0)
      );

  return order
    .map((g) => {
      const subset = buckets.get(g) ?? [];
      const score = averageOrdinalScore(subset, targetHeader);
      return { group: g, avg: score?.avg ?? 0, n: subset.length };
    })
    .filter((g) => g.n > 0);
}
