import { useMemo, useState } from "react";
import type { SurveyData } from "../types";

const PAGE_SIZE = 20;

export function DataTable({ data }: { data: SurveyData }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const columns = [data.timestampHeader, ...data.questions.map((q) => q.header)];

  const filtered = useMemo(() => {
    if (!query.trim()) return data.rows;
    const q = query.toLowerCase();
    return data.rows.filter((row) =>
      columns.some((c) => (row[c] ?? "").toLowerCase().includes(q))
    );
  }, [data.rows, query, columns]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(
    clampedPage * PAGE_SIZE,
    clampedPage * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <div>
      <div className="table-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search responses…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
        />
        <span className="table-count">
          {filtered.length} of {data.rows.length} responses
        </span>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              {columns.map((c, i) => (
                <th key={c}>{i === 0 ? "Timestamp" : `Q${data.questions[i - 1].index}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={i}>
                <td className="row-index">
                  {clampedPage * PAGE_SIZE + i + 1}
                </td>
                {columns.map((c) => (
                  <td key={c}>{row[c]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          disabled={clampedPage === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </button>
        <span>
          Page {clampedPage + 1} of {pageCount}
        </span>
        <button
          disabled={clampedPage >= pageCount - 1}
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
