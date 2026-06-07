"use client"

import { SubmittedStudent, UnsubmittedStudent } from "@/types/assessment";
import { getStudentInitials, getSubmittedLabel } from "@/utils/studentWorkUtils";
import { Clock, DocumentText } from "iconsax-react";
import Image from "next/image";

type AnyStudent = SubmittedStudent | UnsubmittedStudent;

type Props = {
  student: AnyStudent;
  classroomName: string;
  isSelected: boolean;
  onClick: () => void;
};

function getStatusBadge(status?: string | null) {
  if (!status) {
    return { label: "NOT SUBMITTED", className: "bg-input-field text-tertiary" };
  }
  const s = status.toUpperCase();
  if (s === "GRADED") return { label: "GRADED", className: "bg-accent-sand text-[#DEA20A]" };
  if (s === "RESUBMITTED") return { label: "RESUBMITTED", className: "bg-light-green text-[#009F15]" };
  if (s === "SUBMITTED") return { label: "SUBMITTED", className: "bg-light-green text-[#009F15]" };
  if (s === "LATE") return { label: "LATE", className: "bg-[#FCD3D3] text-error" };
  return { label: s, className: "bg-input-field text-tertiary" };
}

export default function StudentSubmissionCard({
  student,
  classroomName,
  isSelected,
  onClick,
}: Props) {
  const submission = student.latestSubmission;
  const resourceCount = submission?.submissionResources?.length ?? 0;
  const badge = getStatusBadge(submission?.status);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full min-h-[158px] flex-col rounded-[15px] border bg-white p-5 text-left transition ${
        isSelected
          ? "border-menta shadow-[0_10px_28px_rgba(91,94,221,0.14)]"
          : "border-[lab(90.952% -.0000596046 0)] hover:border-menta/60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-light-lavendar text-sm font-semibold text-menta">
          {student.profileImageUrl ? (
            <Image
              src={student.profileImageUrl}
              alt={student.fullName}
              width={48}
              height={48}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            getStudentInitials(student.fullName)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[18px] font-medium text-primary">
            {student.fullName}
          </p>
          <p className="truncate text-sm text-tertiary">{classroomName}</p>
        </div>

        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}>
          {badge.label}
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
              {submission ? getSubmittedLabel(submission) : "Not submitted"}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
