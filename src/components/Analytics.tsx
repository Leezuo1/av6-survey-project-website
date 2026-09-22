import { useMemo } from "react";
import type { SurveyData } from "../types";
import { aggregateQuestion } from "../lib/aggregate";
import { averageOrdinalScore } from "../lib/score";
import { KpiCard } from "./KpiCard";

// The attitude / frequency Likert items (excludes demographics Q0-Q3 and the
// nominal "strategy" question Q14) — these are the statements worth ranking
// against each other since they share the same 5-point scale shape.
const ATTITUDE_INDICES = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];

export function Analytics({ data }: { data: SurveyData }) {
  const ranked = useMemo(() => {
    return data.questions
      .filter((q) => ATTITUDE_INDICES.includes(q.index))
      .map((q) => ({
        question: q,
        score: averageOrdinalScore(data.rows, q.header),
      }))
      .filter(
        (r): r is { question: typeof r.question; score: NonNullable<typeof r.score> } =>
          r.score !== null
      )
      .sort((a, b) => b.score.avg - a.score.avg);
  }, [data]);

  const overallQ = data.questions.find((q) => q.index === 11);
  const overallScore = overallQ
    ? averageOrdinalScore(data.rows, overallQ.header)
    : null;

  const yearQ = data.questions.find((q) => q.index === 0);
  const topYear = yearQ
    ? [...aggregateQuestion(data.rows, yearQ.header, 0)].sort(
        (a, b) => b.count - a.count
      )[0]
    : undefined;

  const platformQ = data.questions.find((q) => q.index === 2);
  const topPlatform = platformQ
    ? [...aggregateQuestion(data.rows, platformQ.header)].sort(
        (a, b) => b.count - a.count
      )[0]
    : undefined;

  const top3 = ranked.slice(0, 3);
  const bottom3 = [...ranked].slice(-3).reverse();

  return (
    <div>
      <div className="kpi-row">
        <KpiCard
          label="Responses in view"
          value={String(data.rows.length)}
          accent={1}
        />
        <KpiCard
          label="Overall self-esteem impact"
          value={overallScore ? `${overallScore.avg.toFixed(2)} / 5` : "—"}
          sub={
            overallScore
              ? `${overallScore.scaleLow} → ${overallScore.scaleHigh}`
              : undefined
          }
          accent={2}
        />
        <KpiCard
          label="Most common year"
          value={topYear ? topYear.label : "—"}
          sub={topYear ? `${topYear.pct.toFixed(0)}% of responses` : undefined}
          accent={3}
        />
        <KpiCard
          label="Top platform"
          value={topPlatform ? topPlatform.label : "—"}
          sub={
            topPlatform ? `${topPlatform.pct.toFixed(0)}% of responses` : undefined
          }
          accent={4}
        />
      </div>

      <div className="analytics-grid">
        <div className="panel">
          <h3 className="panel-title">
            Statements ranked by average score (1–5)
          </h3>
          <p className="panel-hint">
            Higher = respondents lean toward the right-hand end of that
            statement's own scale (e.g. "Always", "Strongly Agree",
            "Extremely").
          </p>
          <div className="rank-list">
            {ranked.map(({ question, score }, i) => (
              <div className="rank-row" key={question.header}>
                <div className="rank-index">{i + 1}</div>
                <div className="rank-body">
                  <div className="rank-label">
                    Q{question.index}. {question.short}
                  </div>
                  <div className="rank-bar-track">
                    <div
                      className="rank-bar-fill"
                      style={{ width: `${(score.avg / score.max) * 100}%` }}
                    />
                  </div>
                  <div className="rank-scale">
                    {score.scaleLow} → {score.scaleHigh}
                  </div>
                </div>
                <div className="rank-value">{score.avg.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3 className="panel-title">Key insights</h3>
          <div className="insight-block">
            <div className="insight-heading">Strongest tendencies</div>
            <ul className="insight-list">
              {top3.map(({ question, score }) => (
                <li key={question.header}>
                  <strong>Q{question.index}.</strong> {question.short} —{" "}
                  {score.avg.toFixed(2)}/5
                </li>
              ))}
            </ul>
          </div>
          <div className="insight-block">
            <div className="insight-heading">Weakest tendencies</div>
            <ul className="insight-list">
              {bottom3.map(({ question, score }) => (
                <li key={question.header}>
                  <strong>Q{question.index}.</strong> {question.short} —{" "}
                  {score.avg.toFixed(2)}/5
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
