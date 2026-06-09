import { LatestSubmission } from "@/types/assessment";
import { formatDateLong } from "@/utils/formatDateLong";

export function getSubmittedLabel(submission: LatestSubmission) {
  if (!submission.submittedAt) return "Not submitted";
  return formatDateLong(submission.submittedAt);
}

export function getStudentInitials(name?: string) {
  if (!name) return "ST";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "ST";
}
