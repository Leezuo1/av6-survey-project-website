import type { SurveyData } from "../types";

function parseTsv(text: string): string[][] {
  const clean = text.replace(/\r\n/g, "\n").replace(/﻿/g, "");
  const lines = clean.split("\n").filter((l) => l.length > 0);
  return lines.map((line) => line.split("\t"));
}

export async function fetchSurveyData(url: string): Promise<SurveyData> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet data (HTTP ${res.status})`);
  }
  const text = await res.text();
  const rows = parseTsv(text);
  if (rows.length === 0) {
    throw new Error("The sheet appears to be empty.");
  }

  const [headerRow, ...dataRows] = rows;
  const timestampHeader = headerRow[0]?.trim() ?? "Timestamp";

  const questions = headerRow
    .slice(1)
    .map((header, i) => ({ header: header.trim(), i }))
    .filter((q) => q.header.length > 0)
    .map(({ header, i }) => {
      const match = header.match(/^(\d+)\.\s*(.+)$/);
      return {
        index: match ? Number(match[1]) : i,
        header,
        short: match ? match[2].trim() : header,
        col: i + 1,
      };
    });

  const records = dataRows
    .filter((r) => r.some((cell) => cell.trim().length > 0))
    .map((r) => {
      const record: Record<string, string> = {
        [timestampHeader]: (r[0] ?? "").trim(),
      };
      for (const q of questions) {
        record[q.header] = (r[q.col] ?? "").trim();
      }
      return record;
    });

  return {
    timestampHeader,
    questions: questions.map(({ index, header, short }) => ({
      index,
      header,
      short,
    })),
    rows: records,
  };
}
