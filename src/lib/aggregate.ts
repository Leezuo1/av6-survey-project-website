import { orderOptions } from "./optionOrder";

export interface OptionCount {
  label: string;
  count: number;
  pct: number;
}

// Free-text "Other" answers that don't belong to the intended categories for a
// question (e.g. joke or invalid entries under "What year of study") are kept
// in the raw data but excluded from this question's chart.
const ANSWER_ALLOWLIST: Record<number, string[]> = {
  0: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
};

export function aggregateQuestion(
  rows: Record<string, string>[],
  header: string,
  questionIndex?: number
): OptionCount[] {
  let values = rows.map((r) => r[header]).filter((v) => v && v.length > 0);

  const allow =
    questionIndex !== undefined ? ANSWER_ALLOWLIST[questionIndex] : undefined;
  if (allow) {
    const allowSet = new Set(allow.map((a) => a.toLowerCase()));
    values = values.filter((v) => allowSet.has(v.toLowerCase()));
  }

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
