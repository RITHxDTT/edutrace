import { AssessmentType, SubmissionGrade } from "@/types/assessment";
import { formatDateLong } from "@/utils/formatDateLong";
import { Award } from "iconsax-react";
import React from "react";

type Props = {
  grade: SubmissionGrade | null;
  assessment: AssessmentType;
};

export default function GradeScoreCard({ grade, assessment }: Props) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* Score card */}
      <div className="flex items-center gap-5 rounded-[14px] bg-accent-sand/50 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-sand">
          <Award size={28} color="#DEA20A" variant="Bold" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-tertiary">
            Your Score
          </p>
          <p className="text-[38px] font-bold leading-none text-[#DEA20A]">
            {grade?.score}
            {assessment.maxScore != null && (
              <span className="text-[20px] font-medium text-tertiary">
                {" "}
                / {assessment.maxScore}
              </span>
            )}
          </p>
          {(grade?.graderName || grade?.gradedAt) && (
            <p className="mt-1 text-sm text-tertiary">
              {grade.graderName && (
                <>
                  Graded by{" "}
                  <span className="font-medium text-primary">
                    {grade.graderName}
                  </span>
                </>
              )}
              {grade.gradedAt && <> · {formatDateLong(grade.gradedAt)}</>}
            </p>
          )}
        </div>
      </div>

      {/* Instructor feedback */}
      {grade?.feedback && (
        <div className="rounded-[14px] border border-[lab(90.952% -.0000596046 0)] p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tertiary">
            Instructor Feedback
          </p>
          <p className="text-sm leading-relaxed text-primary">
            {grade?.feedback}
          </p>
        </div>
      )}
    </div>
  );
}
