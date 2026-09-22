export interface Question {
  index: number;
  header: string;
  short: string;
}

export interface SurveyData {
  timestampHeader: string;
  questions: Question[];
  rows: Record<string, string>[];
}
