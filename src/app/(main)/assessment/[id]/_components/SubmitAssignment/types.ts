// ── Submit Assignment ─────────────────────────────────────────────────────────

export interface Instructor {
  name: string;
  avatar?: string;
  role: string;
}

export interface EvaluationFile {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface EvaluationResult {
  score: number;
  total: number;
  comment: string;
  evaluatedAt: string;
  instructor: Instructor;
  feedback: string;
  files?: EvaluationFile[];
}
