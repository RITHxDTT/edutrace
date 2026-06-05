"use client";

import { useState } from "react";
import { gradeSubmissionAction } from "@/actions/assessment.action";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import PrimaryInput from "@/components/Inputs/PrimaryInputField";
import { AssessmentSubmission } from "@/types/assessment";
import { Award, Calendar, RefreshCircle } from "iconsax-react";
import StudentWorkFileCard from "./StudentWorkFileCard";
import { getSubmittedLabel } from "@/utils/studentWorkUtils";

type Props = {
  submission: AssessmentSubmission;
  onSubmissionChange?: (submission: AssessmentSubmission) => void;
};

export default function SubmissionOverview({
  submission,
  onSubmissionChange,
}: Props) {
  const resources = submission.submissionResources ?? [];
  const [score, setScore] = useState(
    submission.grade?.score !== undefined ? String(submission.grade.score) : "",
  );
  const [feedback, setFeedback] = useState(submission.grade?.feedback ?? "");
  const [scoreError, setScoreError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGrade = async () => {
    const nextScore = Number(score);
    setSubmitError("");
    setSuccessMessage("");

    if (!score.trim() || Number.isNaN(nextScore) || nextScore < 0) {
      setScoreError("Please enter a valid score.");
      return;
    }

    setScoreError("");
    setIsSubmitting(true);

    const result = await gradeSubmissionAction({
      submissionId: submission.submissionId,
      score: nextScore,
      feedback,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || "Failed to grade submission.");
      return;
    }

    const nextSubmission: AssessmentSubmission = {
      ...submission,
      status: "GRADED",
      grade: {
        ...submission.grade,
        score: nextScore,
        feedback,
        gradedAt: new Date().toISOString(),
      },
    };

    onSubmissionChange?.(nextSubmission);
    setSuccessMessage("Submission graded.");
  };

  return (
    <div className="flex flex-col gap-5 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-tertiary">
            <Calendar size={18} color="#5B5EDD" />
            Submitted
          </div>
          <p className="font-medium text-primary">{getSubmittedLabel(submission)}</p>
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

        <div className="col-span-2 rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-tertiary">
            <Award size={18} color="#009F15" />
            Grade
          </div>
          <p className="font-medium text-primary">
            {submission.grade?.score !== undefined
              ? `${submission.grade.score} pts`
              : "Not graded yet"}
          </p>
          {submission.grade?.feedback && (
            <p className="mt-2 text-sm text-tertiary">{submission.grade.feedback}</p>
          )}
        </div>
      </div>

      <div className="rounded-[10px] border border-[lab(90.952% -.0000596046 0)] p-4">
        <p className="mb-3 text-[18px] font-medium text-primary">Evaluate Student Work</p>
        <div className="flex flex-col gap-3">
          <PrimaryInput
            label="Score"
            type="number"
            inputType="secondary"
            min={0}
            placeholder="100"
            value={score}
            isInvalid={!!scoreError}
            errorMessage={scoreError}
            onChange={(event) => {
              setScore(event.target.value);
              setScoreError("");
            }}
          />

          <label className="flex flex-col gap-1.5">
            <span className="font-semibold text-label text-sm">Feedback</span>
            <textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Write feedback for this student"
              className="min-h-[110px] resize-none rounded-[8px] border border-zinc-200/60 bg-transparent px-[18px] py-3 text-sm text-primary outline-none transition focus:border-primary/30"
            />
          </label>

          {submitError && (
            <p className="rounded-[8px] bg-[#FCD3D3] px-3 py-2 text-sm font-medium text-error">
              {submitError}
            </p>
          )}

          {successMessage && (
            <p className="rounded-[8px] bg-light-green px-3 py-2 text-sm font-medium text-[#009F15]">
              {successMessage}
            </p>
          )}

          <PrimaryButton
            size="sm"
            className="self-end"
            disabled={isSubmitting}
            onClick={() => {
              void handleGrade();
            }}
          >
            {isSubmitting ? "Saving..." : "Save Evaluation"}
          </PrimaryButton>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[18px] font-medium text-primary">Submitted Files</p>
        <div className="flex flex-col gap-3">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <StudentWorkFileCard
                key={resource.submissionResourceId ?? resource.resourceUrl}
                resource={resource}
              />
            ))
          ) : (
            <p className="rounded-[10px] bg-input-field px-4 py-3 text-sm text-tertiary">
              No submitted files.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
