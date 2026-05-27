export type AssessmentStatus =
  | "Not Yet"
  | "In Progress"
  | "Closed"
  | "Archived";

export interface Attachment {
  id: number;
  name: string;
  type: "docx" | "zip" | "youtube" | "pdf" | "image";
  size?: string; // e.g. "1.2 MB"
  url: string;
  action: "Download" | "Open";
}

export interface GradingCriteria {
  label: string;
  points: number;
}

export interface Assessment {
  id: number;
  category: string;
  title: string;
  description: string;
  status: AssessmentStatus;
  startDate: string;
  endDate: string;
  assignedBy?: string;
  points?: number;
  requirements?: string[];
  attachments?: Attachment[];
  gradingRubric?: GradingCriteria[];
  passingScore?: number;
  requiredDailyMinutes?: number;
  daysUntilDeadline?: number;
}
