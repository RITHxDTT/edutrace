import { AssessmentType } from "@/types/assessment";
import { Calendar, Clock } from "iconsax-react";
import AssessmentSectionCard from "../AssessmentSectionCard";

type Props = {
  assessment: AssessmentType;
};

function getDaysUntilDeadline(dueAt?: string) {
  if (!dueAt) return null;

  const now = new Date();
  const deadline = new Date(dueAt);
  const diffMs = deadline.getTime() - now.getTime();

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function formatDeadlineLabel(days: number | null) {
  if (days === null || Number.isNaN(days)) return "No deadline";
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export default function AssessmentTime({ assessment }: Props) {
  const daysUntilDeadline = getDaysUntilDeadline(assessment.dueAt);

  return (
    <AssessmentSectionCard title="Assessment Time" icon={Clock}>
      <div className="h-[180px] rounded-[15px] rounded-t-none rounded-t-none border-1 border-t-0 border-[lab(90.952% -.0000596046 0)] bg-white p-[30px]">
        <div className="grid h-full grid-cols-2 gap-4">
          <div className="flex items-center gap-2 h-fit rounded-[8px] bg-transparent border-1 px-4 py-3">
            <div className="mb-3 flex gap-3 p-3 items-center justify-center rounded-full bg-light-blue">
              <Clock size={20} color="#20AEE6" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-tertiary">Required Daily (minutes)</p>
              <p className="text-[24px] font-semibold text-primary">
                {assessment.requiredDailyMinutes ?? 0}
                <span className="ml-1 text-sm font-medium text-tertiary">min</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 h-fit rounded-[8px] bg-transparent border-1 px-4 py-3">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-light-lavendar">
              <Calendar size={20} color="#5B5EDD" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-tertiary">Until Deadline</p>
              <p className="text-[24px] font-semibold text-primary">
                {formatDeadlineLabel(daysUntilDeadline)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AssessmentSectionCard>
  );
}
