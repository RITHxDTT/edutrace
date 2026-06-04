"use client";

import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import { AssessmentSubmission } from "@/types/assessment";
import { CloseCircle } from "iconsax-react";
import SubmissionOverview from "./SubmissionOverview";
import SubmissionTimeTracking from "./SubmissionTimeTracking";
import { getStudentInitials } from "./studentWorkUtils";

type Props = {
  submission: AssessmentSubmission | null;
  onClose: () => void;
};

export default function SubmissionDetailDrawer({ submission, onClose }: Props) {
  if (!submission) return null;

  const tabs = [
    {
      key: "overview",
      title: "Overview",
      content: <SubmissionOverview submission={submission} />,
    },
    {
      key: "time-tracking",
      title: "Time Tracking",
      content: <SubmissionTimeTracking submission={submission} />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close submission details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-full max-w-[560px] flex-col bg-white shadow-[-14px_0_36px_rgba(17,24,39,0.14)]">
        <div className="flex items-start justify-between gap-4 border-b border-[lab(90.952% -.0000596046 0)] px-7 py-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-light-lavendar text-sm font-semibold text-menta">
              {getStudentInitials(submission.studentName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[22px] font-semibold text-primary">
                {submission.studentName ?? "Unnamed Student"}
              </p>
              <p className="truncate text-sm text-tertiary">
                {submission.classroomName ?? submission.classroomAbbre ?? "No class"}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 text-tertiary transition hover:bg-input-field"
          >
            <CloseCircle size={26} color="#444655" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5">
          <PrimaryTabs tabs={tabs} colors="primary" />
        </div>
      </aside>
    </div>
  );
}
