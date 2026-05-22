import AssessmentItem from "./AssessmentItem";
import { Assessment } from "../types";

interface Props {
  assessments: Assessment[];
}

export default function AssessmentGrid({ assessments }: Props) {
  return (
    <div className="grid grid-cols-3 gap-5 items-start">
      {assessments.map((assessment) => (
        <AssessmentItem key={assessment.id} assessment={assessment} />
      ))}
    </div>
  );
}
