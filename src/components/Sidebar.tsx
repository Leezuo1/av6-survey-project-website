import type { ReactElement } from "react";

export type Tab = "overview" | "analytics" | "responses";

const ICONS: Record<Tab, ReactElement> = {
  overview: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20V10" strokeLinecap="round" />
      <path d="M11 20V4" strokeLinecap="round" />
      <path d="M18 20v-7" strokeLinecap="round" />
    </svg>
  ),
  responses: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M3.5 9.5h17M9 9.5V21" />
    </svg>
  ),
};

const LABELS: Record<Tab, string> = {
  overview: "Overview",
  analytics: "Analytics",
  responses: "Responses",
};

export function Sidebar({
  active,
  onChange,
  responseCount,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  responseCount: number;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">SD</div>
        <div>
          <div className="sidebar-brand-title">Survey Dashboard</div>
          <div className="sidebar-brand-sub">{responseCount} responses</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {(Object.keys(LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            className={active === tab ? "sidebar-item active" : "sidebar-item"}
            onClick={() => onChange(tab)}
          >
            <span className="sidebar-icon">{ICONS[tab]}</span>
            {LABELS[tab]}
          </button>
        ))}
      </nav>
    </aside>
  );
}
