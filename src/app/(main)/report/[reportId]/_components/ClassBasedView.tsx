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
  isExportMode?: boolean;
}

type ReportMode = "ALL_CLASSES" | "SINGLE_CLASS" | "TASK";

function getReportMode(report: ReportDetailResponse): ReportMode {
  if (report.reportType === "ASSESSMENT") {
    return "TASK";
  }

  const classrooms = report.reportData.classrooms;

  if (classrooms && classrooms.length > 1) {
    return "ALL_CLASSES";
  }

  return "SINGLE_CLASS";
}

export default function ClassBasedView({
  report,
  isExportMode = false,
}: Props) {
  useSWR(
    !isExportMode && report.reportId ? report.reportId : null,
    getReportDetail,
  );

  const summary = report.reportData.summary;
  const classroom = report.reportData.classroom;
  const classrooms = report.reportData.classrooms ?? [];
  const students = report.reportData.students?.data ?? [];
  const classComparison = report.reportData.classComparison;
  const scoreAnalysis = report.reportData.scoreAnalysis;
  const submissionBreakdown = report.reportData.submissionBreakdownByClass;
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
    {
      title: "Total Submitted",
      value: summary.totalSubmitted ?? 0,
    },
    {
      title: "Submission Rate",
      value: `${summary.totalSubmissionRate ?? 0}%`,
    },
    {
      title: "Avg. Score",
      value: `${summary.averageScore ?? 0}%`,
    },
    {
      title: "On-Time",
      value: summary.onTime ?? 0,
    },
    {
      title: "Late",
      value: summary.late ?? 0,
    },
    {
      title: "Missing",
      value: summary.missing ?? 0,
    },
  ];

  return (
    <div className={isExportMode ? "pb-4 px-2" : "pb-20 px-4 md:px-6"}>
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
        <div>
          <h1 className="text-2xl font-semibold">{report.reportName}</h1>

          <p className="text-sm text-gray-500">
            {displayPeriod} - Viewing:{" "}
            <span className="text-blue-600">
              {report.reportData.viewingLabel}
            </span>
          </p>
        </div>

        {!isExportMode && <AllClassesActions reportId={report.reportId} />}
      </div>

      {/* KPI */}

      <div className="mt-6 flex flex-col xl:flex-row gap-4">
        <div className="w-full xl:w-[400px]">
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

      {/* MULTI CLASS */}

      {isAllClasses && (
        <section
          className={`grid grid-cols-1 xl:grid-cols-4 gap-4  ${isExportMode ? "mt-[180px] mb-[180px]" : "mt-6"}`}>
          <div className={`xl:col-span-3 flex flex-col ${isExportMode ? " gap-15 " :"gap-4" }`}>
            <div className="bg-white rounded-2xl p-5 ">
              <h3 className="text-xl font-semibold mb-4">
                Submission Breakdown
              </h3>

              <BasicBars data={submissionBreakdown?.data ?? []} />
            </div>

            <div className="bg-white rounded-2xl p-5  ">
              <h3 className="text-xl font-semibold mb-4">Score Analysis</h3>

              <HorizontalBars
                data={
                  scoreAnalysis?.data?.map((item: any) => ({
                    className: item.className,

                    classroomAbbre: item.classroomAbbre,

                    averageScore: item.averageScore,

                    secondAverageScore: item.submissionRate,
                  })) ?? []
                }
              />
            </div>
          </div>

          <div className={`flex flex-col ${isExportMode? "gap-12 mt-[190px]": "gap-4"}`}>
            {classComparison?.data?.map((cls: any) => (
              <ClassSubmissionCard
                key={cls.classroomId}
                lateSubmission={cls.late}
                submitted={cls.submitted}
                total={cls.totalStudents}
                className={cls.className}
              />
            ))}
          </div>
        </section>
      )}

      {/* SINGLE CLASS */}

      {isSingleClass && (
        <>
          {isExportMode ? (
            <div className="mt-6 flex flex-col gap-4 ">
              <div className="p-10 bg-white rounded-2xl">
                <h3 className="font-medium mb-2">Average Scores</h3>

                <TickPlacementBars data={scoreDistribution?.data ?? []} />
              </div>

              <div className="bg-white rounded-2xl">
                <SubmissionDonutChart
                  onTime={summary.onTime}
                  late={summary.late}
                  missing={summary.missing}
                  total={summary.totalStudents}
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 p-10">
              <div className="p-10 bg-white rounded-2xl ">
                <h3 className="font-medium mb-2 ">Average Scores</h3>

                <TickPlacementBars data={scoreDistribution?.data ?? []} />
              </div>

              <div className="bg-white rounded-2xl">
                <SubmissionDonutChart
                  onTime={summary.onTime}
                  late={summary.late}
                  missing={summary.missing}
                  total={summary.totalStudents}
                />
              </div>
            </div>
          )}

          <div className="mt-6 bg-white rounded-2xl p-5   border-gray-50">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Student List</h3>

              <p className="text-sm text-gray-500">
                {students.length} Students
              </p>
            </div>

            <TableStudent
              students={students}
              classroomAbbre={classroom?.classroomAbbre}
            />
          </div>
        </>
      )}

      {!isExportMode && (
        <div className="fixed bottom-0 right-0 z-50">
          <AiChatWrapper />
        </div>
      )}
    </div>
  );
}
