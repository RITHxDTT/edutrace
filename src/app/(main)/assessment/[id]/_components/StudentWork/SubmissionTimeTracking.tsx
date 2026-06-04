import { AssessmentSubmission } from "@/types/assessment";
import { Clock, TimerStart } from "iconsax-react";
import { formatDateLong } from "@/utils/formatDateLong";

type Props = {
  submission: AssessmentSubmission;
};

function formatMinutes(minutes?: number) {
  const safeMinutes = Math.max(minutes ?? 0, 0);
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  return `${hours}h ${remainingMinutes}m`;
}

export default function SubmissionTimeTracking({ submission }: Props) {
  const sessions = submission.workSessions ?? [];

  return (
    <div className="flex flex-col gap-5 pt-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
          <p className="text-xs text-tertiary">Total Time</p>
          <p className="mt-1 text-[22px] font-semibold text-primary">
            {formatMinutes(submission.totalTimeSpentMinutes)}
          </p>
        </div>

        <div className="rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
          <p className="text-xs text-tertiary">Today</p>
          <p className="mt-1 text-[22px] font-semibold text-primary">
            {formatMinutes(submission.timeSpentTodayMinutes)}
          </p>
        </div>

        <div className="rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
          <p className="text-xs text-tertiary">Remaining</p>
          <p className="mt-1 text-[22px] font-semibold text-primary">
            {formatMinutes(submission.remainingDailyMinutes)}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[18px] font-medium text-primary">Work Sessions</p>
        <div className="flex max-h-[430px] flex-col gap-3 overflow-y-auto pr-1">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.workSessionId ?? `${session.startedAt}-${session.endedAt}`}
                className="flex items-center justify-between gap-3 rounded-[10px] border border-[lab(90.952% -.0000596046 0)] px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-full bg-light-blue p-2.5">
                    <TimerStart size={18} color="#20AEE6" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">
                      {formatDateLong(session.startedAt)}
                    </p>
                    <p className="text-xs text-tertiary">
                      {session.status ?? "Tracked session"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                  <Clock size={16} color="#5B5EDD" />
                  {formatMinutes(session.durationMinutes)}
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-[10px] bg-input-field px-4 py-3 text-sm text-tertiary">
              No time tracking sessions yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
