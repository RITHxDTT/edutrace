"use client";

import { useState } from "react";
import { ChevronRight, Calendar, Filter, ChevronDown } from "lucide-react";

import AssessmentCard from "./_components/AssessmentCard";

type Status = "In Progress" | "Completed" | "Not Started";

interface Assessment {
  id: number;
  category: string;
  title: string;
  description: string;
  status: Status;
  startDate: string;
  endDate: string;
}

const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 1,
    category: "Web",
    title: "Web Development",
    description:
      "Develop a responsive and user-friendly website that works smoothly across desktop, tablet, and mobile devices.",
    status: "In Progress",
    startDate: "05 Mar 2026",
    endDate: "13 Mar 2026",
  },
  {
    id: 2,
    category: "Java",
    title: "Java Mini-Project 002",
    description: "Please read the instruction in the Google Docs carefully.",
    status: "In Progress",
    startDate: "11 Mar 2026",
    endDate: "14 Mar 2026",
  },
  {
    id: 3,
    category: "Web",
    title: "Java Mini-Project 002",
    description: "Please read the instruction in the Google Docs carefully.",
    status: "Completed",
    startDate: "11 Mar 2026",
    endDate: "14 Mar 2026",
  },
];

const STATUS_OPTIONS = [
  "All Status",
  "In Progress",
  "Completed",
  "Not Started",
] as const;

const statusStyles: Record<Status, string> = {
  "In Progress": "bg-indigo-50 text-indigo-400",
  Completed: "bg-emerald-50 text-emerald-600",
  "Not Started": "bg-slate-100 text-slate-500",
};

function CategoryBadge({ label }: { label: string }) {
  return (
    <div
      className=" bg-indigo-50 text-indigo-600  font-semibold  rounded-lg w-13.25 h-8.75 text-center flex justify-center items-center

"
    >
      {label}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-lg ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function DateRow({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  return (
    <div className="flex items-center gap-4 text-sm text-slate-500">
      <span className="flex items-center gap-1">
        <Calendar size={14} />
        {startDate}
      </span>

      <span className="flex items-center gap-1">
        <Calendar size={14} />
        {endDate}
      </span>
    </div>
  );
}

/* CARD ITEM */
function AssessmentItem({ assessment }: { assessment: Assessment }) {
  return (
    <AssessmentCard className="overflow-hidden flex flex-col">
      <div className="p-5 flex flex-col gap-4 h-full">
        <CategoryBadge label={assessment.category} />

        <div>
          <h3 className="text-xl font-bold text-indigo-700">
            {assessment.title}
          </h3>

          <p className="text-sm text-slate-500 mt-2 line-clamp-3">
            {assessment.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <StatusBadge status={assessment.status} />

          <button className="flex items-center gap-1 text-indigo-600  text-sm">
            View Details
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="border-t pt-4">
          <DateRow
            startDate={assessment.startDate}
            endDate={assessment.endDate}
          />
        </div>
      </div>
    </AssessmentCard>
  );
}

export default function AssessmentPage() {
  const [statusFilter, setStatusFilter] = useState<string>("All Status");

  const filtered =
    statusFilter === "All Status"
      ? MOCK_ASSESSMENTS
      : MOCK_ASSESSMENTS.filter((a) => a.status === statusFilter);

  return (
    <div className="min-h-screen p-8">
      {/* Top Bar */}
      <div className="flex justify-end mb-6">
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold">
          Create Assessment
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border p-4 flex items-center gap-3 mb-6">
        <Filter size={16} />

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none border rounded-lg px-3 py-2 pr-8 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((assessment) => (
          <AssessmentItem key={assessment.id} assessment={assessment} />
        ))}
      </div>
    </div>
    
  );
}
