import { useEffect, useState } from "react";
import { SHEET_TSV_URL, SURVEY_TITLE } from "./config";
import { fetchSurveyData } from "./lib/tsv";
import type { SurveyData } from "./types";
import { Dashboard } from "./components/Dashboard";
import { DataTable } from "./components/DataTable";
import "./App.css";

type Tab = "dashboard" | "data";
type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: SurveyData };

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [state, setState] = useState<LoadState>({ status: "loading" });

  async function load() {
    setState({ status: "loading" });
    try {
      const data = await fetchSurveyData(SHEET_TSV_URL);
      setState({ status: "ready", data });
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

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">{SURVEY_TITLE}</h1>
          <p className="app-subtitle">Live survey results dashboard</p>
        </div>
        <button className="refresh-btn" onClick={load}>
          Refresh
        </button>
      </header>

      {state.status === "ready" && (
        <nav className="tabs">
          <button
            className={tab === "dashboard" ? "tab active" : "tab"}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={tab === "data" ? "tab active" : "tab"}
            onClick={() => setTab("data")}
          >
            Responses
          </button>
        </nav>
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
        {state.status === "ready" && tab === "dashboard" && (
          <Dashboard data={state.data} />
        )}
        {state.status === "ready" && tab === "data" && (
          <DataTable data={state.data} />
        )}
      </main>
    </div>
  );
}
