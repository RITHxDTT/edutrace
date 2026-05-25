import dynamic from "next/dynamic";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import KpiCardComponent from "../_components/KpiCardComponent";
import KpiCardTaskBased from "../taskbased/_components/KpiCardTaskBased";

const BasicBars = dynamic(() => import("./_components/barChartThreeLine"));

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

export default function AllClassesPage() {
  const {
    reportName,
    viewingLabel,
    period,
    submissionDatas: summary,
    classroom,
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
        <div className="flex items-center gap-1">
          <PrimaryButton>Back</PrimaryButton>
          <PrimaryButton>Export PDF</PrimaryButton>
        </div>
      </div>

      <div className="flex items-start mt-6">
        <KpiCardTaskBased
          totalStudents={summary.totalStudents}
          className={classroom.className}
        />
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

      <section className="mt-5">
        {/* Submission Breakdown */}
        <div className="bg-white p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Submission Breakdown</h3>
            </div>
            <div className="flex items-center justify-evenly gap-6 mt-4 w-100 ">
              <div className="flex items-center gap-2">
                <p className="bg-purple w-4 h-4 rounded-full inline-block"></p>
                <p>On-Time</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="bg-accent-purple w-4 h-4 rounded-full inline-block"></p>
                <p>Late</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="bg-light-purple w-4 h-4 rounded-full inline-block"></p>
                <p>Missing</p>
              </div>
            </div>
          </div>
          <BasicBars />
        </div>

        {/* Score Analysis */}
        <div>
          {/* axis barChart */}
        </div>
      </section>
    </div>
  );
}
