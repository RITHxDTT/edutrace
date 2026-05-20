import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import NavbarTitle from "@/components/Topbar/NavbarTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Growthyflow - Assessment",
};

export default function AssessmentPage() {
  return (
    <div>
      <NavbarTitle title="Assessment" override />
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
