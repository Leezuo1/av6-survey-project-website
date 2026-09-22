import { useEffect, useMemo, useState } from "react";
import { SHEET_TSV_URL, SURVEY_TITLE } from "./config";
import { fetchSurveyData } from "./lib/tsv";
import { applyFilters, DEFAULT_FILTERS, type Filters } from "./lib/filters";
import type { SurveyData } from "./types";
import { Sidebar, type Tab } from "./components/Sidebar";
import { FilterBar } from "./components/FilterBar";
import { Dashboard } from "./components/Dashboard";
import { Analytics } from "./components/Analytics";
import { DataTable } from "./components/DataTable";
import "./App.css";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: SurveyData };

const TAB_TITLES: Record<Tab, string> = {
  overview: "Overview",
  analytics: "Analytics",
  responses: "Responses",
};

export default function App() {
  const [tab, setTab] = useState<Tab>("overview");
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  async function load() {
    setState({ status: "loading" });
    try {
      const data = await fetchSurveyData(SHEET_TSV_URL);
      setState({ status: "ready", data });
      setLastSyncedAt(new Date());
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  useEffect(() => {
    load();
  }, []);

  const yearQ =
    state.status === "ready"
      ? state.data.questions.find((q) => q.index === 0)
      : undefined;
  const platformQ =
    state.status === "ready"
      ? state.data.questions.find((q) => q.index === 2)
      : undefined;

  const filteredData = useMemo(() => {
    if (state.status !== "ready") return null;
    return applyFilters(state.data, filters, yearQ?.header, platformQ?.header);
  }, [state, filters, yearQ, platformQ]);

  return (
    <div className="app-shell">
      {state.status === "ready" && (
        <Sidebar
          active={tab}
          onChange={setTab}
          responseCount={state.data.rows.length}
          lastSyncedAt={lastSyncedAt}
        />
      )}
      <div className="app-content">
        <header className="app-header">
          <div>
            <h1 className="app-title">
              {state.status === "ready" ? TAB_TITLES[tab] : "Survey Dashboard"}
            </h1>
            <p className="app-subtitle">{SURVEY_TITLE}</p>
          </div>
          <div className="header-actions">
            <button className="export-btn" onClick={() => window.print()}>
              Export report
            </button>
            <button className="refresh-btn" onClick={load}>
              Refresh
            </button>
          </div>
        </header>

        {state.status === "ready" && tab !== "responses" && (
          <FilterBar
            data={state.data}
            yearHeader={yearQ?.header}
            yearIndex={0}
            platformHeader={platformQ?.header}
            filters={filters}
            onChange={setFilters}
          />
        )}

        <main className="app-main">
          {state.status === "loading" && (
            <div className="state-msg">Loading survey data…</div>
          )}
          {state.status === "error" && (
            <div className="state-msg error">
              Couldn't load data: {state.message}
            </div>
          )}
          {state.status === "ready" && filteredData && tab === "overview" && (
            <Dashboard data={filteredData} />
          )}
          {state.status === "ready" && filteredData && tab === "analytics" && (
            <Analytics data={filteredData} />
          )}
          {state.status === "ready" && tab === "responses" && (
            <DataTable data={state.data} />
          )}
        </main>
      </div>
    </div>
  );
}
