import { PrimaryButton } from "@/components/Buttons/PrimaryButton";

export default function AssessmentPage() {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="text-[24px] font-medium">Assessment</p>
          <p>Manage assessments, deadlines, and progress</p>
        </div>
        <div>
            <PrimaryButton>Create Assessment</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
