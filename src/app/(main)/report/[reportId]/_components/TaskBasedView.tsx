"use client";

import dynamic from "next/dynamic";

import KpiCardTaskBased from "../../_components/_taskBase/KpiCardTaskBased";
import KpiCardComponent from "../../_components/KpiCardComponent";
import TopPerformersCard from "../../_components/_taskBase/TopPerformersCard";
import AtRiskStudentsCard from "../../_components/_taskBase/AtRiskStudentsCard";
import TaskBasedActions from "../../_components/_taskBase/TaskBasedAction";
import AiChatWrapper from "../../AI/AiChatWrapper";

const TickPlacementBars = dynamic(() => import("../../_components/_taskBase/BarChart"));
const SubmissionDonutChart = dynamic(() =>
  import("../../_components/_taskBase/SubmissionDonutChart").then((m) => m.SubmissionDonutChart),
);


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
const atRiskStudentsMock = [{ score: 66, riskLevel: "MEDIUM" as const, studentName: "Ratha Tep" }];

export default function TaskBasedView({ summary, metadata }: TaskBasedViewProps) {
  const reportName = metadata?.reportName || "Report Analysis Detail";
  const displayPeriod = metadata?.generatedAt
    ? new Date(metadata.generatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Active Analysis";

  const totalStudents = summary?.totalStudents ?? 0;
  const onTime = summary?.onTime ?? 0;
  const late = summary?.late ?? 0;
  const missing = summary?.missing ?? 0;

  const kpiCards = [
    { title: "Total Submitted", value: summary?.totalSubmitted ?? 0 },
    { title: "Submission Rate", value: `${summary?.totalSubmissionRate ?? 0}%` },
    { title: "Avg. Score", value: summary?.averageScore ?? 0 },
    { title: "On-Time", value: onTime },
    { title: "Late", value: late },
    { title: "Missing", value: missing },
  ];

  return (
    <div className="pb-8 p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-[24px] font-medium">{reportName}</p>
          <p className="text-sm text-gray-500">
            {displayPeriod} - Viewing: <span className="text-blue-600 font-medium">Assessment Performance</span>
          </p>
        </div>
        <TaskBasedActions />
      </div>

      <div className="flex items-start mt-6">
        <div className="w-111 h-111">
          <KpiCardTaskBased totalStudents={totalStudents} className="Active Classroom" />
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4 ml-4">
          {kpiCards.map((card) => (
            <KpiCardComponent key={card.title} title={card.title} value={card.value} />
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl shadow border border-gray-50">
          <h3 className="font-medium mb-2 text-gray-700">Average Scores</h3>
          <TickPlacementBars data={scoreDistributionMock} />
        </div>
        <div className="h-full">
          <SubmissionDonutChart onTime={onTime} late={late} missing={missing} total={totalStudents} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <TopPerformersCard data={topPerformersMock} />
        <AtRiskStudentsCard data={atRiskStudentsMock} />
      </div>

      <div className="fixed bottom-0 right-0 pointer-events-none z-50">
        <AiChatWrapper />
      </div>
    </div>
  );
}