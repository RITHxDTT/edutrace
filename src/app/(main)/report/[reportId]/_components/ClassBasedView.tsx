"use client";

import KpiCardComponent from "../../_components/KpiCardComponent";
import KpiCardTaskBased from "../../_components/_taskBase/KpiCardTaskBased";
import ClassSubmissionCard from "../../../../../types/ClassSubmissionCard";
import AllClassesActions from "../../_components/_classBase/AllClassesAction";
import BasicBars from "../../_components/_classBase/barChartThreeLine";
import HorizontalBars from "../../_components/_classBase/barChartAxis";
import AiChatWrapper from "../../AI/AiChatWrapper";
import TableStudent from "./TableStudent";
import { SubmissionDonutChart } from "../../_components/_taskBase/SubmissionDonutChart";
import TickPlacementBars from "../../_components/_taskBase/BarChart";
import useSWR from "swr";
import { getReportDetail } from "@/services/report.service";
import { ReportDetailResponse } from "@/types/report";

interface Props {
  report: ReportDetailResponse;
  isExportMode?: boolean; // Added flag to disable fetching hooks during print operations
}

type ReportMode = "ALL_CLASSES" | "SINGLE_CLASS" | "TASK";

function getReportMode(report: ReportDetailResponse): ReportMode {
  if (report.reportType === "ASSESSMENT") {
    return "TASK";
  }

  const classroom = report.reportData.classroom;

  if (!classroom || !("classroomId" in classroom)) {
    return "ALL_CLASSES";
  }

  return "SINGLE_CLASS";
}

export default function ClassBasedView({
  report,
  isExportMode = false,
}: Props) {
  // CRITICAL: Conditionally pass null to useSWR if in export mode so it doesn't break on authentication
  const { data: reports, error } = useSWR(
    !isExportMode && report.reportId ? report.reportId : null,
    getReportDetail,
  );

  const summary = report.reportData.summary;
  const classroom = report.reportData.classroom;
  const students = report.reportData.students?.data ?? [];
  const submission = report.reportData.submission;
  const scoreDistribution = report.reportData.scoreDistribution;

  const mode = getReportMode(report);

  const isAllClasses = mode === "ALL_CLASSES";
  const isSingleClass = mode === "SINGLE_CLASS";

  const displayPeriod = new Date(report.generatedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const kpiCards = [
    { title: "Total Submitted", value: summary.totalSubmitted },
    { title: "Submission Rate", value: `${summary.totalSubmissionRate}%` },
    { title: "Avg. Score", value: `${summary.averageScore}%` },
    { title: "On-Time", value: summary.onTime },
    { title: "Late", value: summary.late },
    { title: "Missing", value: summary.missing },
  ];

  return (
    <div className={`${isExportMode ? "pb-4 px-2" : "pb-20 px-4 md:px-6"}`}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{report.reportName}</h1>

          <p className="text-sm text-gray-500">
            {displayPeriod} - Viewing:{" "}
            <span className="text-blue-600">
              {report.reportData.viewingLabel}
            </span>
          </p>
        </div>

        {/* Hide action buttons when rendering inside a printed layout */}
        {!isExportMode && <AllClassesActions />}
      </div>

      {/* KPI Section */}
      <div className="mt-6 flex flex-col xl:flex-row gap-4">
        <div className="w-full xl:w-[340px]">
          <KpiCardTaskBased
            totalStudents={summary.totalStudents}
            className={
              isAllClasses
                ? "All Classes"
                : `${classroom?.classroomAbbre ?? "Class"} Class`
            }
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

      {/* Charts / All Classes Insights Layout */}
      {isAllClasses && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-6">
          <div className="xl:col-span-3 flex flex-col gap-4">
            {/* Score Analysis Chart wrapper */}
            <div className="bg-white rounded-2xl p-5 shadow border border-gray-50">
              <h3 className="text-xl font-semibold mb-4">Score Analysis</h3>

              <HorizontalBars
                data={[
                  {
                    className: classroom?.className,
                    averageScore: summary.averageScore,
                    classroomAbbre: classroom?.classroomAbbre,
                    secondAverageScore: summary.totalSubmissionRate,
                  },
                ]}
              />
            </div>
          </div>

          {/* Side Card Insights Widget */}
          <div>
            <ClassSubmissionCard
              lateSubmission={summary.late}
              submitted={summary.totalSubmitted}
              total={summary.totalStudents}
              className={classroom?.className ?? "Class"}
            />
          </div>
        </div>
      )}

      {/* Average Performance Data Analysis Widgets */}
      <div className="mt-6 grid grid-cols-2 gap-4 break-inside-avoid">
        <div className="p-5 bg-white rounded-2xl shadow border border-gray-50">
          <h3 className="font-medium mb-2">Average Scores</h3>
          <TickPlacementBars data={scoreDistribution?.data ?? []} />
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

      {/* Student list Table Grid breakdown view wrapper context */}
      <div className="mt-6 bg-white rounded-2xl p-5 shadow border border-gray-50 break-inside-avoid">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Student List</h3>
          <p className="text-sm text-gray-500">{students.length} Students</p>
        </div>

        <TableStudent
          students={students}
          classroomAbbre={classroom?.classroomAbbre}
        />
      </div>

      {/* Floating interactive AI components should never show in print streams */}
      {!isExportMode && (
        <div className="fixed bottom-0 right-0 z-50">
          <AiChatWrapper />
        </div>
      )}
    </div>
  );
}
