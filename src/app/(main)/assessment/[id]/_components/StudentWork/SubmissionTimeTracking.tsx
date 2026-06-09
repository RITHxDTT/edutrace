import { SubmissionDetail } from "@/types/assessment";
import { Award, Clock, DocumentText, RefreshCircle, TimerStart } from "iconsax-react";
import { formatDateLong } from "@/utils/formatDateLong";

type Props = {
  submission: SubmissionDetail;
};

function formatMinutes(minutes?: number) {
  const safeMinutes = Math.max(minutes ?? 0, 0);
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  return `${hours}h ${remainingMinutes}m`;
}

function formatDateTime(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function SubmissionTimeTracking({ submission }: Props) {
  const sessions = submission.workSessions ?? [];
  const resources = submission.submissionResources ?? [];
  const hasSubmission = !!submission.submissionId;

  return (
    <div className="flex flex-col gap-5 pt-4">
      {hasSubmission && (
        <div>
          <p className="mb-3 text-[18px] font-medium text-primary">Submission Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
              <p className="text-xs text-tertiary">Status</p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {submission.status ?? "N/A"}
              </p>
            </div>

            <div className="rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
              <p className="text-xs text-tertiary">Submitted At</p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {formatDateTime(submission.submittedAt)}
              </p>
            </div>

            <div className="rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-tertiary">
                <RefreshCircle size={18} color="#DEA20A" />
                Resubmission
              </div>
              <p className="font-medium text-primary">
                {submission.isResubmission ? "Yes" : "No"}
              </p>
            </div>

            <div className="rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-tertiary">
                <Award size={18} color="#009F15" />
                Grade
              </div>
              <p className="font-medium text-primary">
                {submission.grade?.score !== undefined
                  ? `${submission.grade.score} pts`
                  : "Not graded yet"}
              </p>
              {submission.grade?.gradedAt && (
                <p className="mt-1 text-xs text-tertiary">
                  {formatDateTime(submission.grade.gradedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
        <p className="mb-3 text-[18px] font-medium text-primary">Submission Activity</p>
        <div className="flex max-h-[260px] flex-col gap-3 overflow-y-auto pr-1">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <div
                key={resource.submissionResourceId ?? resource.resourceUrl}
                className="flex items-center justify-between gap-3 rounded-[10px] border border-[lab(90.952% -.0000596046 0)] px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-full bg-light-lavendar p-2.5">
                    <DocumentText size={18} color="#5B5EDD" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">
                      {resource.fileName ?? resource.resourceUrl}
                    </p>
                    <p className="text-xs text-tertiary">
                      {resource.resourceType ?? "FILE"}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-xs font-medium text-tertiary">
                  {formatDateTime(resource.uploadedAt ?? resource.updatedAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-[10px] bg-input-field px-4 py-3 text-sm text-tertiary">
              No submitted resources from this submission detail.
            </p>
          )}
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
