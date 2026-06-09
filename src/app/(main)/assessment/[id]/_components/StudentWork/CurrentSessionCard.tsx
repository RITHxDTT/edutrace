import { WorkSession } from "@/types/assessment";
import { formatWorkMinutes, formatWorkTimer } from "./MyStudentWorkPage";

type Props = {
  activeSession: WorkSession | null;
  currentSessionSeconds: number;
  trackedTotalMinutes: number;
  totalMinutes: number;
};

export default function CurrentSessionCard({
  activeSession,
  currentSessionSeconds,
  trackedTotalMinutes,
  totalMinutes,
}: Props) {
  return (
    <div className="rounded-[20px] bg-white p-7.5 flex flex-col justify-between">
      <div>
        <p className="text-[18px] font-semibold text-primary mb-4">
          Current Session
        </p>
        <div className="rounded-[15px] bg-input-field p-5">
          <p className="text-sm text-tertiary">Current Session Timer</p>
          <p className="text-[40px] font-semibold text-primary">
            {formatWorkTimer(currentSessionSeconds)}
          </p>
          <p className="mt-4 text-sm text-tertiary">Total Time Spent</p>
          <p className="text-[28px] font-semibold text-primary">
            {formatWorkMinutes(
              activeSession ? trackedTotalMinutes : totalMinutes,
            )}
          </p>
        </div>
      </div>
      {activeSession && (
        <p className="text-xs text-tertiary mt-4">
          This timer keeps running when you switch tabs and ends when you leave
          this assessment.
        </p>
      )}
    </div>
  );
}
