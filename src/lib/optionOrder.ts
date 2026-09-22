// Known ordered scales used across the survey. If a question's set of distinct
// answers matches one of these (order-insensitive), we display bars in the
// scale's natural order instead of sorting by count.
const KNOWN_SCALES: string[][] = [
  ["Never", "Rarely", "Sometimes", "Often", "Always"],
  [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
  [
    "Much worse",
    "Slightly worse",
    "No change",
    "Slightly better",
    "Much better",
  ],
  ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  [
    "Less than 1 hour",
    "1–3 hours",
    "3–5 hours",
    "More than 5 hours",
  ],
];

export function orderOptions(values: string[]): {
  labels: string[];
  isScale: boolean;
} {
  const distinct = Array.from(new Set(values));
  const distinctSet = new Set(distinct.map((v) => v.toLowerCase()));

  for (const scale of KNOWN_SCALES) {
    const scaleSet = new Set(scale.map((v) => v.toLowerCase()));
    const overlap = distinct.every((v) => scaleSet.has(v.toLowerCase()));
    if (overlap && distinct.length > 0) {
      const ordered = scale.filter((s) => distinctSet.has(s.toLowerCase()));
      return { labels: ordered, isScale: true };
    }
  }

  return { labels: distinct, isScale: false };
}
