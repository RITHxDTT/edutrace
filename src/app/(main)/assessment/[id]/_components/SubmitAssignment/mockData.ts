import { EvaluationFile, EvaluationResult } from "./types";

//          Student's submitted files (shown in both states) ──────────────────────────
export const MOCK_SUBMITTED_FILES: EvaluationFile[] = [
  {
    name: "12_KEO_VUTHTHANA_SR_WEB_001.zip",
    size: "6.2 MB",
    type: "ZIP",
    url: "/files/12_KEO_VUTHTHANA_SR_WEB_001.zip",
  },
  {
    name: "ui_screenshot.png",
    size: "860 KB",
    type: "PNG",
    url: "/files/ui_screenshot.png",
  },
];

//          Evaluated mockup        ───────────
export const MOCK_EVALUATION: EvaluationResult = {
  score: 92,
  total: 100,
  comment: "Excellent work!",
  evaluatedAt: "12th May 2026, 11:00 PM",

  instructor: {
    name: "Tan Dara",
    avatar: "/images/profile/teacher_dara.jpg",
    role: "Instructor",
  },

  feedback:
    "Great job! Your project is well-structured and shows strong understanding of the requirements. Keep improving on UI consistency and performance optimization.",

  files: MOCK_SUBMITTED_FILES,
};

//          Not yet evaluated mockup        ───
export const MOCK_PENDING: EvaluationResult | null = null;
export const TEST_EVALUATION: EvaluationResult | null = MOCK_PENDING;
