import { useMemo } from "react";
import type { SurveyData } from "../types";
import { aggregateQuestion } from "../lib/aggregate";
import { QuestionChart } from "./QuestionChart";

export function Dashboard({ data }: { data: SurveyData }) {
  const charts = useMemo(
    () =>
      data.questions.map((q) => ({
        question: q,
        options: aggregateQuestion(data.rows, q.header, q.index),
      })),
    [data]
  );

  return (
    <div className="chart-grid">
      {charts.map(({ question, options }) => (
        <QuestionChart
          key={question.header}
          title={`Q${question.index}. ${question.short}`}
          data={options}
        />
      ))}
    </div>
  );
}
