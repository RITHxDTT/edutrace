import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { MusicDashboard, TaskSquare } from "iconsax-react";
import React from "react";

export default function AssessmentPage() {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="text-[24px] font-medium">Assessment</p>
          <p>Manage assessments, deadlines, and progress</p>
        </div>
        <div>
            <PrimaryButton variant={"disable"} >Click Me</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
