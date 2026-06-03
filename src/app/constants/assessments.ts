export const ASSESSMENT_TYPES = [
    "ASSIGNMENT",
    "PRACTICE",
    "HOMEWORK",
    "MINI_PROJECT",
] as const;

export type AssessmentType = typeof ASSESSMENT_TYPES[number];

export const ASSESSMENT_TYPE_LABELS: Record<AssessmentType, string> = {
    ASSIGNMENT: "Assignment",
    PRACTICE: "Practice",
    HOMEWORK: "Homework",
    MINI_PROJECT: "Mini Project",
};