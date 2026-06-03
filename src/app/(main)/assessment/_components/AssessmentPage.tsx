"use client";
import { useState } from "react";
import NavbarTitle from "@/components/Topbar/NavbarTitle";
import FilterTask from "./FilterTask";
import AssessmentList from "./AssessmentList";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { AssessmentType } from "@/types/assessment";
import { SubjectType } from "@/types/subject";
import CreateAssessmentModal from "./CreateAssessmentModal/CreateAssessmentModal";
import { useDisclosure } from "@heroui/modal";

type FilterState = {
  subject: string;
  status: string;
  sortBy: string;
};

type Props = {
  assessments: AssessmentType[];
  subjects: SubjectType[];
  role?: string;
};

export default function AssessmentPage({ assessments, role, subjects }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    subject: "",
    status: "",
    sortBy: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = assessments
    .filter((a) => (filters.status ? a.status === filters.status : true))
    .filter((a) =>
      filters.subject ? a.subject.subjectId === filters.subject : true,
    )
    .sort((a, b) => {
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
          <>
            <div>
              <PrimaryButton size={"md"} onClick={onOpen}>Create Assessment</PrimaryButton>
            </div>

            <CreateAssessmentModal
              isOpen={isOpen}
              onClose={onClose}
              subjects={subjects}
            />
          </>
        )}
      </div>

      <FilterTask
        filters={filters}
        onFilterChange={handleFilterChange}
        subjects={subjects}
      />

      <AssessmentList assessments={filtered} />
    </div>
  );
}
