import type { SurveyData } from "../types";
import { aggregateQuestion } from "../lib/aggregate";
import { ALL, type Filters } from "../lib/filters";

interface Props {
  data: SurveyData;
  yearHeader?: string;
  yearIndex?: number;
  platformHeader?: string;
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterBar({
  data,
  yearHeader,
  yearIndex,
  platformHeader,
  filters,
  onChange,
}: Props) {
  const yearOptions = yearHeader
    ? aggregateQuestion(data.rows, yearHeader, yearIndex).map((o) => o.label)
    : [];
  const platformOptions = platformHeader
    ? aggregateQuestion(data.rows, platformHeader).map((o) => o.label)
    : [];

  const hasActiveFilter = filters.year !== ALL || filters.platform !== ALL;

  return (
    <div className="filter-bar">
      <span className="filter-bar-label">Filter:</span>
      {yearHeader && (
        <select
          className="filter-select"
          value={filters.year}
          onChange={(e) => onChange({ ...filters, year: e.target.value })}
        >
          <option value={ALL}>All years</option>
          {yearOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
      {platformHeader && (
        <select
          className="filter-select"
          value={filters.platform}
          onChange={(e) => onChange({ ...filters, platform: e.target.value })}
        >
          <option value={ALL}>All platforms</option>
          {platformOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
      {hasActiveFilter && (
        <button
          className="filter-clear"
          onClick={() => onChange({ year: ALL, platform: ALL })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
