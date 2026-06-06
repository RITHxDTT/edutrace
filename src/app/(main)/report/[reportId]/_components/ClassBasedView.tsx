"use client";

import KpiCardComponent from "../../_components/KpiCardComponent";
import KpiCardTaskBased from "../../_components/_taskBase/KpiCardTaskBased";
import ClassSubmissionCard from "../../../../../types/ClassSubmissionCard";
import AllClassesActions from "../../_components/_classBase/AllClassesAction";
import BasicBars from "../../_components/_classBase/barChartThreeLine";
import HorizontalBars from "../../_components/_classBase/barChartAxis";
import AiChatWrapper from "../../AI/AiChatWrapper";
import TableStudent from "./TableStudent";

interface ClassBasedViewProps {
  summary: any;
  metadata: any;
}

export default function ClassBasedView({
  summary,
  metadata,
}: ClassBasedViewProps) {
  const reportName = metadata?.reportName || "All Classes Performance Report";
  
  const isAllClasses = !metadata?.classScope || metadata.classScope === "ALL";
  const viewingLabel = isAllClasses
    ? "All Classes Overview"
    : `${metadata.classScope} Class Overview`;

  const displayPeriod = metadata?.generatedAt
    ? new Date(metadata.generatedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Active Analysis";

  const kpiCards = [
    { title: "Total Submitted", value: summary?.totalSubmitted ?? 0 },
    {
      title: "Submission Rate",
      value: `${summary?.totalSubmissionRate ?? 0}%`,
    },
    { title: "Avg. Score", value: `${summary?.averageScore ?? 0}%` },
    { title: "On-Time", value: summary?.onTime ?? 0 },
    { title: "Late", value: summary?.late ?? 0 },
    { title: "Missing", value: summary?.missing ?? 0 },
  ];

  const chartsMock = {
    submissionBreakdownByClass: {
      data: [
        {
          late: 14,
          onTime: 73,
          missing: 13,
          className: "Siem Reap Class",
          classroomAbbre: "SR",
        },
        {
          late: 7,
          onTime: 75,
          missing: 18,
          className: "Phnom Penh Class",
          classroomAbbre: "PP",
        },
      ],
    },
    scoreAnalysis: {
      data: [
        {
          className: "Siem Reap Class",
          averageScore: 78,
          classroomAbbre: "SR",
          secondAverageScore: 81,
        },
        {
          className: "Phnom Penh Class",
          averageScore: 83,
          classroomAbbre: "PP",
          secondAverageScore: 85,
        },
      ],
    },
    classComparison: {
      data: [
        {
          late: 3,
          className: "Siem Reap Class",
          submitted: 19,
          classroomId: "1",
          totalStudents: 22,
        },
        {
          late: 2,
          className: "Phnom Penh Class",
          submitted: 23,
          classroomId: "2",
          totalStudents: 28,
        },
      ],
    },
  };

  return (
    <div className="pb-8 p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-[24px] font-medium">{reportName}</p>
          <p className="text-sm text-gray-500">
            {displayPeriod} - Viewing:{" "}
            <span className="text-blue-600">{viewingLabel}</span>
          </p>
        </div>
        <AllClassesActions />
      </div>

      <div className="flex items-start mt-6">
        <div className="w-111 h-111">
          <KpiCardTaskBased
            totalStudents={summary?.totalStudents ?? 0}
            className={isAllClasses ? "All Classes" : `${metadata?.classScope || "Class"} Class`}
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

      {!isAllClasses ? (
        <section className="mt-5 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-2xl font-semibold">Students Performance</h3>
            </div>
            <TableStudent
              students={summary?.students || []}
              classroomAbbre={metadata?.classScope}
            />
          </div>
        </section>
      ) : (
        <section className="mt-5 grid grid-cols-4 gap-4">
          <div className="col-span-3 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">Submission Breakdown</h3>
              </div>
              <BasicBars data={chartsMock.submissionBreakdownByClass.data} />
            </div>

            <div className="bg-white p-6 rounded-2xl w-full">
              <h3 className="text-2xl font-semibold mb-4">Score Analysis</h3>
              <HorizontalBars data={chartsMock.scoreAnalysis.data} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {chartsMock.classComparison.data.map((cls) => (
              <ClassSubmissionCard
                key={cls.classroomId}
                late={cls.late}
                submitted={cls.submitted}
                total={cls.totalStudents}
                className={cls.className}
              />
            ))}
          </div>
        </section>
      )}

      <div className="fixed bottom-0 right-0 pointer-events-none z-50">
        <AiChatWrapper />
      </div>
    </div>
  );
}
