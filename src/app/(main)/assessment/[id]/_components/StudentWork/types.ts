// ── Assessment ────────────────────────────────────────────────────────────────

export interface Assessment {
  id: number;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  points: number;
}

// ── Student ───────────────────────────────────────────────────────────────────

export interface Student {
  id: number;
  name: string;
  avatar: string;
  file: string;
  date: string;
  time: string;
  size: string;
  status: "Handed In" | "Pending" | "Late";
}

// ── Activity Log ──────────────────────────────────────────────────────────────

export interface ActivityLog {
  id: number;
  type: "submit" | "score" | "feedback";
  student: string;
  action: string;
  file: string;
  datetime: string;
}

// ── Session Log ───────────────────────────────────────────────────────────────

export interface SessionLog {
  id: number;
  date: string;
  start: string;
  end: string;
  duration: number;
  status: "Completed" | "Uncompleted" | "In Progress";
}
