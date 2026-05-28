import { Calendar } from "iconsax-react";

interface Props {
  startDate: string;
  endDate: string;
}

export default function DateRow({ startDate, endDate }: Props) {
  return (
    <div className="flex items-center gap-4 text-sm text-slate-500">
      <span className="flex items-center gap-1">
        <Calendar size={20} color="#6B7280" />
        {startDate}
      </span>

      <span className="flex items-center gap-1">
        <Calendar size={20} color="#6B7280" />
        {endDate}
      </span>
    </div>
  );
}
