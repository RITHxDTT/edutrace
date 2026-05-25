import { Status } from "../types";

const statusStyles: Record<Status, string> = {
  "In Progress": "bg-indigo-50 text-indigo-400",
  Completed: "bg-emerald-50 text-emerald-600",
  "Not Started": "bg-slate-100 text-slate-500",
};

interface Props {
  status: Status;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-lg ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
