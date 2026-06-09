import { AssessmentSubmission } from "@/types/assessment";
import { Award, Calendar, RefreshCircle } from "iconsax-react";
import StudentWorkFileCard from "./StudentWorkFileCard";
import { getSubmittedLabel } from "./studentWorkUtils";

type Props = {
  submission: AssessmentSubmission;
};

export default function SubmissionOverview({ submission }: Props) {
  const resources = submission.submissionResources ?? [];

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
