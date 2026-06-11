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
  isExportMode?: boolean;
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
    <div id="pdf-report" className={isExportMode ? "" : ""}>
      <div className={isExportMode ? "" : ""}>
        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold">{reportName}</p>

            <p className="text-sm text-gray-500">
              {displayPeriod} - Viewing:
              <span className="text-blue-600 font-medium">
                Assessment Performance
              </span>
            </p>
          </div>

          {!isExportMode && <TaskBasedActions reportId={metadata.reportId} />}
        </div>

        {/* KPI */}

        <div className="mt-6 flex flex-col xl:flex-row gap-4 ">
          <div className="w-full xl:w-[420px]">
            <KpiCardTaskBased
              totalStudents={totalStudents}
              className="Active Classroom"
            />
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiCards.map((card) => (
              <KpiCardComponent
                key={card.title}
                title={card.title}
                value={card.value}
              />
            ))}
          </div>
        </div>

        {/* CHARTS */}

      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-4 ${isExportMode ? "mt-[280px] p-5" : "mt-6"}`}>
          <div
            className="bg-white rounded-2xl p-2  flex flex-col">
            <h3 className="font-medium mb-2">Average Scores</h3>

            <TickPlacementBars data={scoreDistributionMock} />
          </div>

          <div
            className="bg-white rounded-2xl p-1 "
          >
            <SubmissionDonutChart
              onTime={onTime}
              late={late}
              missing={missing}
              total={totalStudents}
            />
          </div>
        </div>

        {/* BOTTOM */}

        <div
          className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4"
        >
          <div
            className="rounded-2xl  overflow-hidden"
          >
            <TopPerformersCard data={topPerformersMock} />
          </div>

          <div className="overflow-hidden">
            <AtRiskStudentsCard data={atRiskStudentsMock} />
          </div>
        </div>

        {!isExportMode && (
          <div
            className="fixed bottom-4 right-4 z-50"
          >
            <AiChatWrapper />
          </div>
        )}
      </div>
    </div>
  );
}
