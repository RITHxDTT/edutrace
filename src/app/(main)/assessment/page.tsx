"use client";

import { useState } from "react";

import AssessmentHeader from "./_components/AssessmentHeader";
import AssessmentFilter from "./_components/AssessmentFilter";
import AssessmentGrid from "./_components/AssessmentGrid";

import { Assessment } from "./types";

const STATUS_OPTIONS = [
  "All Status",
  "Not Yet",
  "In Progress",
  "Closed",
  "Archived",
] as const;

export default function AssessmentPage() {
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const assessments: Assessment[] = [
    {
      id: 1,
      category: "Web",
      title: "Web Development",
      description:
        "Develop a responsive and user-friendly website that works smoothly across desktop, tablet, and mobile devices. The task includes designing the layout, building core pages, adding, optimizing performance, and ensuring the site is easy to update and maintain.",
      status: "In Progress",
      startDate: "05 Mar 2026",
      endDate: "13 Mar 2026",
    },
    {
      id: 2,
      category: "Java",
      title: "Java Mini-Project 002",
      description:
        "Please read the instruction in the Google Docs which is the Java Mini-Project 002 - Instruction carefully and submit your GitHub repository.",
      status: "Completed",
      startDate: "01 Apr 2026",
      endDate: "03 Apr 2026",
    },
    {
      id: 3,
      category: "UX/UI",
      title: "Figma Design",
      description:
        "Design a responsive landing page in Figma with a clean and modern layout.",
      status: "Completed",
      startDate: "01 Apr 2026",
      endDate: "03 Apr 2026",
    },
  ];

  const filtered =
    statusFilter === "All Status"
      ? assessments
      : assessments.filter((a) => a.status === statusFilter);

  return (
    <div className="flex-1 min-h-0 px-8 pt-7 pb-10 overflow-visible">
      <AssessmentHeader
        title="Assessment"
        description="Manage assessments, deadlines, and progress"
        buttonText="Create Assessment"
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
        <AssessmentGrid assessments={filtered} />
      </div>
    </div>
  );
}
