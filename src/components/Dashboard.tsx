import { useMemo } from "react";
import type { SurveyData } from "../types";
import { aggregateQuestion } from "../lib/aggregate";
import { QuestionChart } from "./QuestionChart";

export function Dashboard({ data }: { data: SurveyData }) {
  const charts = useMemo(
    () =>
      data.questions.map((q) => ({
        question: q,
        options: aggregateQuestion(data.rows, q.header),
      })),
    [data]
  );

  return (
    <div>
      <div className="stat-row">
        <div className="stat-tile">
          <div className="stat-value">{data.rows.length}</div>
          <div className="stat-label">Total responses</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{data.questions.length}</div>
          <div className="stat-label">Questions</div>
        </div>
      </div>
      <div className="chart-grid">
        {charts.map(({ question, options }) => (
          <QuestionChart
            key={question.header}
            title={`Q${question.index}. ${question.short}`}
            data={options}
          />
        ))}
      </div>
    </div>
  );
}
