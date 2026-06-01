// _components/AssessmentPage.tsx
"use client";
import { useState } from "react";
import NavbarTitle from "@/components/Topbar/NavbarTitle";
import FilterTask from "./FilterTask";
import AssessmentList from "./AssessmentList";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { AssessmentType } from "@/types/assessment";

type FilterState = {
  sortBy: string;
  status: string;
  type: string;
};

type Props = {
  assessments: AssessmentType[];
  role?: string;
};

export default function AssessmentPage({ assessments, role }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "",
    status: "",
    type: "",
  });

  const handleFilterChange = (incoming: FilterState) => {
    setFilters((prev) => ({ ...prev, ...incoming }));
  };

  const filtered = assessments
    .filter((a) => (filters.status ? a.status === filters.status : true))
    .filter((a) => (filters.type ? a.assessmentType === filters.type : true))
    .sort((a, b) => {
      if (filters.sortBy === "TITLE") return a.title.localeCompare(b.title);
      if (filters.sortBy === "ASSESSMENT_TYPE")
        return (a.assessmentType ?? "").localeCompare(b.assessmentType ?? "");
      if (filters.sortBy === "STATUS") return a.status.localeCompare(b.status);
      return 0;
    });

  return (
    <div className="flex flex-col gap-5 p-5">
      <NavbarTitle title="Assessment" override />

      <div className="w-full flex items-center justify-between">
        <div>
          <p className="text-[24px] font-semibold">Assessment</p>
          <p>Manage assessments, deadlines, and progress</p>
        </div>
        {role === "teacher" && (
          <div>
            <PrimaryButton size={"md"}>Create Assessment</PrimaryButton>
          </div>
        )}
      </div>

      <FilterTask onFilterChange={handleFilterChange} />

      <AssessmentList assessments={filtered} />
    </div>
  );
}