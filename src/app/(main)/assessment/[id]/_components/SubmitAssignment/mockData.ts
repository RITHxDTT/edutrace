import { EvaluationResult } from "./types";

// ── Evaluation Result ─────────────────────────────────────────────────────────

export const MOCK_EVALUATION: EvaluationResult = {
  score: 86,
  total: 100,
  comment: "Great work!",
  evaluatedAt: "12th May 2026, 11:00 PM",
  instructor: {
    name: "Tan Dara",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=TanDara&backgroundColor=b6e3f4",
    role: "Instructor",
  },
  feedback:
    "Excellent work! Your project demonstrates a strong understanding of the project requirements. The implementation is clean and well-structured. Keep it up!",
};
export const TEST_EVALUATION: EvaluationResult | null = MOCK_EVALUATION; // pending
