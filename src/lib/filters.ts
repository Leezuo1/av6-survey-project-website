import type { SurveyData } from "../types";

export const ALL = "All";

export interface Filters {
  year: string;
  platform: string;
}

export const DEFAULT_FILTERS: Filters = { year: ALL, platform: ALL };

export function applyFilters(
  data: SurveyData,
  filters: Filters,
  yearHeader: string | undefined,
  platformHeader: string | undefined
): SurveyData {
  if (filters.year === ALL && filters.platform === ALL) return data;

  const rows = data.rows.filter((r) => {
    if (filters.year !== ALL && yearHeader && r[yearHeader] !== filters.year) {
      return false;
    }
    if (
      filters.platform !== ALL &&
      platformHeader &&
      r[platformHeader] !== filters.platform
    ) {
      return false;
    }
    return true;
  });

  return { ...data, rows };
}
