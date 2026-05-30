import dynamic from "next/dynamic";
import KpiCardTaskBased from "./_components/KpiCardTaskBased";
import KpiCardComponent from "../_components/KpiCardComponent";
import TopPerformersCard from "./_components/TopPerformersCard";
import AtRiskStudentsCard from "./_components/AtRiskStudentsCard";
import TaskBasedActions from "./_components/TaskBasedAction";
import AiChatWrapper from "../AI/_components/AI/AiChatWrapper";

const TickPlacementBars = dynamic(() => import("./_components/BarChart"));
const SubmissionDonutChart = dynamic(() =>
  import("./_components/SubmissionDonutChart").then(
    (m) => m.SubmissionDonutChart,
  ),
);

const mockReport = {
  reportName: "REST API Design Sprint - PP Class",
  viewingLabel: "Assessment Performance",
  period: { month: "May", year: 2026 },
  submissionDatas: {
    totalStudents: 55,
    totalSubmitted: 51,
    totalSubmissionRate: 88,
    averageScore: 82,
    onTime: 46,
    late: 3,
    missing: 2,
  },
  classroom: { className: "PP Class" },
  scoreDistribution: [
    { range: "90-100", count: 60 },
    { range: "80-89", count: 45 },
    { range: "70-79", count: 56 },
    { range: "60-69", count: 23 },
    { range: "60>", count: 10 },
  ],
  topPerformers: [
    { rank: 1, score: 94, studentName: "Dara Sok" },
    { rank: 2, score: 91, studentName: "Vicheka Heng" },
    { rank: 3, score: 88, studentName: "Sophea Kim" },
  ],
  atRiskStudents: [
    { score: 66, riskLevel: "MEDIUM" as const, studentName: "Ratha Tep" },
    { status: "MISSING", riskLevel: "HIGH" as const, studentName: "Mony Chea" },
  ],
};

export default function page() {
  const {
    reportName,
    viewingLabel,
    period,
    submissionDatas: summary,
    classroom,
    scoreDistribution,
    topPerformers,
    atRiskStudents,
  } = mockReport;

  const kpiCards = [
    { title: "Total Submitted", value: summary.totalSubmitted },
    { title: "Submission Rate", value: `${summary.totalSubmissionRate}%` },
    { title: "Avg. Score", value: summary.averageScore },
    { title: "On-Time", value: summary.onTime },
    { title: "Late", value: summary.late },
    { title: "Missing", value: summary.missing },
  ];

  return (
    <div className="pb-8">
      <div className="flex justify-between">
        <div>
          <p className="text-[24px] font-medium">{reportName}</p>
          <p>
            {period.month} {period.year} - Viewing:{" "}
            <span className="text-blue-600">{viewingLabel}</span>
          </p>
        </div>
        <TaskBasedActions />
      </div>

      <div className="flex items-start mt-6">
        <div className="w-111 h-111">
          <KpiCardTaskBased
            totalStudents={summary.totalStudents}
            className={classroom.className}
          />
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4 ml-4">
          {kpiCards.map((card) => (
            <KpiCardComponent
              key={card.title}
              title={card.title}
              value={card.value}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl shadow">
          <h3 className="font-medium mb-2">Average Scores</h3>
          <TickPlacementBars data={scoreDistribution} />
        </div>
        <div className="h-full">
          <SubmissionDonutChart
            onTime={summary.onTime}
            late={summary.late}
            missing={summary.missing}
            total={summary.totalStudents}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <TopPerformersCard data={topPerformers} />
        <AtRiskStudentsCard data={atRiskStudents} />
      </div>
      <div className="fixed bottom-0 right-0 pointer-events-none z-50">
        <AiChatWrapper />
      </div>
    </div>
  );
}
