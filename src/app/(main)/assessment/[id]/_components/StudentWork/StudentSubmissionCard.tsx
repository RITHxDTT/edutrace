"use client"

import { AssessmentSubmission } from "@/types/assessment";
import { Clock, DocumentText } from "iconsax-react";
import Image from "next/image";
import { getStudentInitials, getSubmittedLabel } from "./studentWorkUtils";
type Props = {
  submission: AssessmentSubmission;
  profileImageUrl?: string;
  isSelected: boolean;
  onClick: () => void;
};

export default function StudentSubmissionCard({
  submission,
  profileImageUrl,
  isSelected,
  onClick,
}: Props) {
  const resourceCount = submission.submissionResources?.length ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full min-h-[158px] flex-col rounded-[15px] border bg-white p-5 text-left transition ${isSelected
        ? "border-menta shadow-[0_10px_28px_rgba(91,94,221,0.14)]"
        : "border-[lab(90.952% -.0000596046 0)] hover:border-menta/60"
        }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-light-lavendar text-sm font-semibold text-menta">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={submission.student?.fullName ?? "Student profile"}
              width={48}
              height={48}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            getStudentInitials(submission.student?.fullName)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[18px] font-medium text-primary">
            {submission.student?.fullName ?? "Unnamed Student"}
          </p>
          <p className="truncate text-sm text-tertiary">
            {submission.student?.classroom.className ?? submission.student?.classroom.classroomAbbre ?? "No class"}
          </p>
        </div>

        <span className="rounded-full bg-light-green px-3 py-1 text-xs font-medium text-[#009F15]">
          {submission.status ?? "SUBMITTED"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-[8px] bg-input-field px-3 py-2">
          <DocumentText size={18} color="#5B5EDD" />
          <div className="min-w-0">
            <p className="text-xs text-tertiary">Files</p>
            <p className="text-sm font-medium text-primary">{resourceCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-[8px] bg-input-field px-3 py-2">
          <Clock size={18} color="#20AEE6" />
          <div className="min-w-0">
            <p className="text-xs text-tertiary">Submitted</p>
            <p className="truncate text-sm font-medium text-primary">
              {getSubmittedLabel(submission)}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
