"use client";

import { useEffect, useState } from "react";

import AssessmentHeader from "./_components/AssessmentHeader";
import AssessmentFilter from "./_components/AssessmentFilter";
import AssessmentGrid from "./_components/AssessmentGrid";
import CreateTaskModal from "./_components/CreateTaskModal";

import { Assessment } from "./types";
import { DEFAULT_ASSESSMENTS, STORAGE_KEY } from "./mockData";
import { useRole } from "./hook/useRole";

import { Skeleton } from "@/components/ui/skeleton";

const STATUS_OPTIONS = [
  "All Status",
  "Not Yet",
  "In Progress",
  "Closed",
  "Archived",
] as const;

function loadAssessments(): Assessment[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Assessment[];
  } catch {}

  return DEFAULT_ASSESSMENTS;
}

function saveAssessments(assessments: Assessment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  } catch {}
}

export default function AssessmentPage() {
  const { isStudent } = useRole();

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);

  useEffect(() => {
    setAssessments(loadAssessments());
  }, []);

  useEffect(() => {
    if (assessments !== null) saveAssessments(assessments);
  }, [assessments]);

  const handleCreate: NonNullable<
    React.ComponentProps<typeof CreateTaskModal>["onCreate"]
  > = (data) => {
    const newAssessment: Assessment = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      assignedBy: "Tan Dara",
      points: data.points,
      attachments: data.attachments,
      gradingRubric: data.gradingRubric,
      passingScore: data.passingScore,
      requiredDailyMinutes: data.requiredDailyMinutes,
      daysUntilDeadline: data.daysUntilDeadline,
      requirements: [],
    };

    setAssessments((prev) => [newAssessment, ...(prev ?? [])]);
    setIsModalOpen(false);
  };

  const filtered =
    assessments === null
      ? []
      : statusFilter === "All Status"
        ? assessments
        : assessments.filter((a) => a.status === statusFilter);

  return (
    <>
      <div className="flex-1 min-h-0 px-8 pt-7 pb-10 overflow-visible">
        <AssessmentHeader
          title="Assessment"
          description="Manage assessments, deadlines, and progress"
          buttonText={!isStudent ? "Create Assessment" : undefined}
          onClick={!isStudent ? () => setIsModalOpen(true) : undefined}
        />

        <div className="relative z-50">
          <AssessmentFilter
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="relative z-0 pt-6">
          {assessments === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>

                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />

                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-28" />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AssessmentGrid assessments={filtered} />
          )}
        </div>
      </div>

      {!isStudent && isModalOpen && (
        <CreateTaskModal
          onClose={() => setIsModalOpen(false)}
          onBack={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}