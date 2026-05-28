"use client";

import NavbarTitle from "@/components/Topbar/NavbarTitle";
import { useEffect, useState } from "react";
import AssessmentFilter from "./AssessmentFilter";
import AssessmentGrid from "./AssessmentGrid";
import AssessmentHeader from "./AssessmentHeader";
import CreateTaskModal from "./CreateTaskModal";

import { DEFAULT_ASSESSMENTS, STORAGE_KEY } from "../mockData";
import { Assessment } from "../types";

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

interface AssessmentPageProps {
  isStudent: boolean;
}

export default function AssessmentPage({ isStudent }: AssessmentPageProps) {
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

  const handleCreate = (data: {
    title: string;
    acceptLate: boolean;
    instruction: string;
    assessmentDate: string;
    dailyRequired: string;
    point: string;
    topic: string;
    classes: string[];
    gradingRubric: string;
    attachments: File[];
  }) => {
    const parts = data.assessmentDate.split("-").map((s) => s.trim());
    const startDate = parts[0] || "-";
    const endDate = parts[1] || "-";

    const newAssessment: Assessment = {
      id: Date.now(),
      category: data.topic || "General",
      title: data.title || "Untitled",
      description: data.instruction || "No description provided.",
      status: "In Progress",
      startDate,
      endDate,
      assignedBy: "Tan Dara",
      points: Number(data.point) || 100,
      requiredDailyMinutes: Number(data.dailyRequired) || 60,
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
      <NavbarTitle title="Assessment" override />
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

        <div className="relative z-0">
          {assessments === null ? (
            <div className="text-sm text-gray-400 pt-10 text-center">
              Loading...
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
