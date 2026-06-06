"use client";

import KpiCardComponent from "../../_components/KpiCardComponent";
import KpiCardTaskBased from "../../_components/_taskBase/KpiCardTaskBased";
import ClassSubmissionCard from "../../../../../types/ClassSubmissionCard";
import AllClassesActions from "../../_components/_classBase/AllClassesAction";
import BasicBars from "../../_components/_classBase/barChartThreeLine";
import HorizontalBars from "../../_components/_classBase/barChartAxis";
import AiChatWrapper from "../../AI/AiChatWrapper";
import TableStudent from "./TableStudent";

import { ReportDetailResponse } from "@/types/report";

interface Props {
  report: ReportDetailResponse;
}

export default function ClassBasedView({ report }: Props) {
  const summary = report.reportData.summary;

  const classroom = report.reportData.classroom;

  const students = report.reportData.students?.data ?? [];

  const submission = report.reportData.submission;

  const isAllClasses = !classroom;

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
      value: summary.totalSubmitted,
    },

    {
      title: "Submission Rate",
      value: `${summary.totalSubmissionRate}%`,
    },

    {
      title: "Avg. Score",
      value: `${summary.averageScore}%`,
    },

    {
      title: "On-Time",
      value: summary.onTime,
    },

    {
      title: "Late",
      value: summary.late,
    },

    {
      title: "Missing",
      value: summary.missing,
    },
  ];

  return (
    <div className="pb-20 px-4 md:px-6">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{report.reportName}</h1>

          <p className="text-sm text-gray-500">
            {displayPeriod}

            {" - Viewing: "}

            <span className="text-blue-600">
              {report.reportData.viewingLabel}
            </span>
          </p>
        </div>

        <AllClassesActions />
      </div>

      {/* KPI SECTION */}

      <div className="mt-6 flex flex-col xl:flex-row gap-4">
        <div className="w-full xl:w-[340px]">
          <KpiCardTaskBased
            totalStudents={summary.totalStudents}
            className={
              isAllClasses
                ? "All Classes"
                : `${classroom?.classroomAbbre} Class`
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

      {/* ANALYTICS */}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-6">
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5">
            <h3 className="text-xl font-semibold mb-4">Submission Breakdown</h3>

            <BasicBars
              data={[
                {
                  late: submission?.late ?? 0,

                  onTime: submission?.onTime ?? 0,

                  missing: submission?.missing ?? 0,

                  className: classroom?.className ?? "Class",

                  classroomAbbre: classroom?.classroomAbbre,
                },
              ]}
            />
          </div>

          <div className="bg-white rounded-2xl p-5">
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

        <div>
          <ClassSubmissionCard
            late={summary.late}
            submitted={summary.totalSubmitted}
            total={summary.totalStudents}
            className={classroom?.className ?? "Class"}
          />
        </div>
      </div>

      {/* STUDENT TABLE ALWAYS AT BOTTOM */}

      <div className="mt-6 bg-white rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Student List</h3>

          <p className="text-sm text-gray-500">{students.length} Students</p>
        </div>

        <TableStudent
          students={students}
          classroomAbbre={classroom?.classroomAbbre}
        />
      </div>

      <div className="fixed bottom-0 right-0 z-50">
        <AiChatWrapper />
      </div>
    </div>
  );
}
