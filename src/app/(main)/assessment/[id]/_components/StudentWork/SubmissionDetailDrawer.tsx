"use client";

import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import { SubmissionDetail } from "@/types/assessment";
import { CloseCircle } from "iconsax-react";
import Image from "next/image";
import SubmissionOverview from "./SubmissionOverview";
import SubmissionTimeTracking from "./SubmissionTimeTracking";
import { getStudentInitials } from "@/utils/studentWorkUtils";

type Props = {
  submission: SubmissionDetail | null;
  isLoading?: boolean;
  error?: string | null;
  onSubmissionChange?: (submission: SubmissionDetail) => void;
  onClose: () => void;
};

export default function SubmissionDetailDrawer({
  submission,
  isLoading = false,
  error,
  onSubmissionChange,
  onClose,
}: Props) {
  if (!submission) return null;

  const profileImageUrl = submission.student?.profileImageUrl;
  const hasSubmission = !!submission.submissionId;

  const tabs = [
    ...(hasSubmission
      ? [
          {
            key: "overview",
            title: "Overview",
            content: (
              <SubmissionOverview
                submission={submission}
                onSubmissionChange={onSubmissionChange}
              />
            ),
          },
        ]
      : []),
    {
      key: "time-tracking",
      title: hasSubmission ? "Time Tracking" : "Progress",
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
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={submission.student?.fullName ?? "Student profile"}
                  width={52}
                  height={52}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getStudentInitials(submission.student?.fullName)
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[22px] font-semibold text-primary">
                {submission.student?.fullName ?? "Unnamed Student"}
              </p>
              <p className="truncate text-sm text-tertiary">
                {submission.student?.classroom?.classroomAbbre ?? "No Class"}
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
          {isLoading && (
            <p className="mb-3 rounded-[8px] bg-input-field px-4 py-2 text-sm text-tertiary">
              Loading submission details...
            </p>
          )}

          {error && (
            <p className="mb-3 rounded-[8px] bg-[#FCD3D3] px-4 py-2 text-sm font-medium text-error">
              {error}
            </p>
          )}

          <PrimaryTabs tabs={tabs} colors="primary" />
        </div>
      </aside>
    </div>
  );
}
