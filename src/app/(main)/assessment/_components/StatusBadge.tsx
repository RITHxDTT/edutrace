export type AssessmentStatus =
  | "Not Yet"
  | "In Progress"
  | "Closed"
  | "Archived";

const statusStyles: Record<AssessmentStatus, string> = {
  "Not Yet": "bg-indigo-50 text-indigo-500",
  "In Progress": "bg-blue-100 text-blue-600",
  Closed: "bg-emerald-50 text-emerald-600",
  Archived: "bg-rose-50 text-rose-500",
};

interface Props {
  status: AssessmentStatus;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
