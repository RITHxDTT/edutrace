"use client";

import dynamic from "next/dynamic";

import KpiCardTaskBased from "../../_components/_taskBase/KpiCardTaskBased";
import KpiCardComponent from "../../_components/KpiCardComponent";
import TopPerformersCard from "../../_components/_taskBase/TopPerformersCard";
import AtRiskStudentsCard from "../../_components/_taskBase/AtRiskStudentsCard";
import TaskBasedActions from "../../_components/_taskBase/TaskBasedAction";
import AiChatWrapper from "../../AI/AiChatWrapper";
import TickPlacementBars from "../../_components/_taskBase/BarChart";

import { SubmissionDonutChart } from "../../_components/_taskBase/SubmissionDonutChart";



interface TaskSummary {
  totalStudents?: number;
  onTime?: number;
  late?: number;
  missing?: number;
  totalSubmitted?: number;
  totalSubmissionRate?: number;
  averageScore?: number | string;
}

interface ReportMetadata {
  reportName?: string;
  generatedAt?: string | Date;
  reportId: string;
}

interface TaskBasedViewProps {
  summary: TaskSummary;
  metadata: ReportMetadata;
}

const scoreDistributionMock = [
  { range: "90-100", count: 60 },
  { range: "80-89", count: 45 },
  { range: "70-79", count: 56 },
  { range: "60-69", count: 23 },
  { range: "60>", count: 10 },
];

const topPerformersMock = [{ rank: 1, score: 94, studentName: "Dara Sok" }];
const atRiskStudentsMock = [
  { score: 66, riskLevel: "MEDIUM" as const, studentName: "Ratha Tep" },
];

export default function TaskBasedView({
  summary,
  metadata,
  isExportMode = false,
}: TaskBasedViewProps) {
  const reportName = metadata?.reportName || "Report Analysis Detail";

  const displayPeriod = metadata?.generatedAt
    ? new Date(metadata.generatedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Active Analysis";

  const totalStudents = summary?.totalStudents ?? 0;
  const onTime = summary?.onTime ?? 0;
  const late = summary?.late ?? 0;
  const missing = summary?.missing ?? 0;

  const kpiCards = [
    { title: "Total Submitted", value: summary?.totalSubmitted ?? 0 },
    {
      title: "Submission Rate",
      value: `${summary?.totalSubmissionRate ?? 0}%`,
    },
    { title: "Avg. Score", value: summary?.averageScore ?? 0 },
    { title: "On-Time", value: onTime },
    { title: "Late", value: late },
    { title: "Missing", value: missing },
  ];

  return (
    <div
      id="pdf-report"
      className={isExportMode ? "p-2 pb-4" : "pb-8 p-4 sm:p-6"}
    >
      <div className={isExportMode ? "p-2 pb-4" : "pb-8 p-4 sm:p-6"}>
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xl sm:text-2xl font-medium">{reportName}</p>
            <p className="text-xs sm:text-sm text-gray-500">
              {displayPeriod} - Viewing:{" "}
              <span className="text-blue-600 font-medium">
                Assessment Performance
              </span>
            </p>
          </div>
          {!isExportMode && <TaskBasedActions reportId={metadata.reportId} />}
        </div>

        {/* KPI Section */}
        <div className="mt-6 flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[260px]">
            <KpiCardTaskBased
              totalStudents={totalStudents}
              className="Active Classroom"
            />
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {kpiCards.map((card) => (
              <KpiCardComponent
                key={card.title}
                title={card.title}
                value={card.value}
              />
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 bg-white rounded-2xl shadow border border-gray-50">
            <h3 className="font-medium mb-2 text-gray-700">Average Scores</h3>
            <TickPlacementBars data={scoreDistributionMock} />
          </div>

          <div className="p-4 sm:p-5 bg-white rounded-2xl shadow border border-gray-50">
            <SubmissionDonutChart
              onTime={onTime}
              late={late}
              missing={missing}
              total={totalStudents}
            />
          </div>
        </div>

        {/* Bottom cards */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopPerformersCard data={topPerformersMock} />
          <AtRiskStudentsCard data={atRiskStudentsMock} />
        </div>

        {/* AI Chat */}
        {!isExportMode && (
          <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50">
            <AiChatWrapper />
          </div>
        )}
      </div>
    </div>
  );
}
