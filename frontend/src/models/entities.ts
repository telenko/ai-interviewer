export type Vacancy = {
  PK: string;
  SK: string;
  title: string;
  skills: string[];
  progress: number;
  url?: string;
  score: number;
  lang_code?: string;
  created_at?: string | null;
  company?: string | null;
};

export type ProgLangEnum = 'py' | 'js' | 'ts' | 'java' | 'c#' | 'dotnet' | 'other';

export type Question = {
  PK: string;
  SK: string;
  question: string;
  answer?: string;
  order: number;
  correctness_score?: number;
  correctness_comment?: string;
  explanation?: string;
  question_type: 'text' | 'coding';
  prog_lang_code?: ProgLangEnum;
};
