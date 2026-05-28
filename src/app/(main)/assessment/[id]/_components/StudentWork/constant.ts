export const FILTER_OPTIONS = ["All Classes", "Class A", "Class B", "Class C"] as const;
export const TOTAL_PAGES = 5;

export const SESSION_STATUS_MAP = {
  Completed:    { bg: "rgba(34,197,94,0.12)",  color: "#16a34a", icon: "✓" },
  Uncompleted:  { bg: "rgba(239,68,68,0.12)",  color: "#dc2626", icon: "✕" },
  "In Progress":{ bg: "rgba(245,158,11,0.12)", color: "#d97706", icon: "⏱" },
} as const;