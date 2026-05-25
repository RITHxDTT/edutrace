"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import KpiCard from "./_components/KpiCardComponent";
import TapComponents from "./_components/TapComponent";
import GenerateReportModalComponent from "./_components/GenerateModalComponent";
import TableDataComponent, { Report } from "./_components/TableDataReport";
const INITIAL_REPORTS: Report[] = [
  {
    reportId: "91000000-0000-4000-8000-000000001602",
    reportName: "Spring Boot Capstone - All Classes Overview",
    reportType: "CLASS",
    displayType: "Class Based",
    period: "May 13, 2026 - May 27, 2026",
    generatedAt: "2026-05-20T03:45:00Z",
  },
  {
    reportId: "91000000-0000-4000-8000-000000001601",
    reportName: "REST API Design Sprint - PP Class",
    reportType: "ASSESSMENT",
    displayType: "Task Based",
    period: "May 2, 2026 - May 12, 2026",
    generatedAt: "2026-05-12T04:15:00Z",
  },
];

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Reports");

  const latestReport = reports.reduce<Report | null>(
    (latest, r) =>
      !latest || new Date(r.generatedAt) > new Date(latest.generatedAt)
        ? r
        : latest,
    null,
  );
  const lastGeneratedDate = latestReport
    ? new Date(latestReport.generatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const summary = {
    totalReports: reports.length,
    taskBasedReports: reports.filter((r) => r.reportType === "ASSESSMENT")
      .length,
    classBasedReports: reports.filter((r) => r.reportType === "CLASS").length,
    lastGenerated: lastGeneratedDate,
  };

  const filteredReports = reports.filter((r) => {
    if (activeTab === "Class Based") return r.reportType === "CLASS";
    if (activeTab === "Task Based") return r.reportType === "ASSESSMENT";
    return true;
  });

  function handleDelete(reportId: string) {
    setReports((prev) => prev.filter((r) => r.reportId !== reportId));
  }

  function handleView(report: Report) {
    const reportDetails = `
      Report Name: ${report.reportName}
      Report Type: ${report.displayType}
      Period: ${report.period}
      Generated At: ${new Date(report.generatedAt).toLocaleString()}
    `;
    alert(reportDetails);
  }

  const kpiCards = [
    { title: "Total Reports", value: summary.totalReports },
    { title: "Task Based", value: summary.taskBasedReports },
    { title: "Class Based", value: summary.classBasedReports },
    { title: "Last Generated", value: summary.lastGenerated },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <div className="">
          <p className="text-[32px] font-medium">Report</p>
          <p className="text-foreground/50">
            Generate and review performance reports for your classes and tasks.
          </p>
        </div>
        <div>
          <PrimaryButton onClick={() => setIsModalOpen(true)}>
            Generate Report
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.title} title={card.title} value={card.value} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold">Your reports</p>
        <TapComponents activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="mt-4">
        <TableDataComponent
          reports={filteredReports}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      <GenerateReportModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
