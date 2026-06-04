"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import KpiCard from "../KpiCardComponent";
import GenerateReportModalComponent from "../GenerateModalComponent";
import TableDataComponent from "../TableDataReport";
import { PaginationBasic } from "../pagination";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import AiChatWrapper from "../../AI/AiChatWrapper";
import {Report} from "../../../../../types/report";

interface ReportSummary {
  totalReports: number;
  taskBasedReports: number;
  classBasedReports: number;
  lastGenerated?: string;
}

interface ReportClientViewProps {
  initialReports: Report[];
  initialSummary: ReportSummary;
  totalPages: number;
}

export default function ReportClientView({
  initialReports,
  initialSummary,
  totalPages,
  // classrooms,
  // taskOptions,
}: ReportClientViewProps) {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [summary, setSummary] = useState<ReportSummary>(initialSummary);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Reports");
  const [page, setPage] = useState(1);

  function handleDelete(reportId: string) {
    setReports((prev) => prev.filter((r) => r.reportId !== reportId));
    setSummary((prev) => ({
      ...prev,
      totalReports: prev.totalReports - 1,
    }));
  }

  function handleView(report: Report) {
    const params = new URLSearchParams({
      reportId: report.reportId,
      reportName: report.reportName,
      period: report.period,
    });

    const route =
      report.reportType === "ASSESSMENT"
        ? "taskbased"
        : report.classScope && report.classScope !== "ALL"
          ? "specificClass"
          : "allclasses";

    router.push(`/report/${route}?${params.toString()}`);
  }

  function handleGenerate(report: Report) {
    setReports((prev) => [report, ...prev]);
    setSummary((prev) => ({
      ...prev,
      totalReports: prev.totalReports + 1,
    }));
  }

  const kpiCards = [
    { title: "Total Reports", value: summary.totalReports },
    { title: "Task Based", value: summary.taskBasedReports },
    { title: "Class Based", value: summary.classBasedReports },
    {
      title: "Last Generated",
      value: summary.lastGenerated
        ? new Date(summary.lastGenerated).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "01 May 2026",
    },
  ];

  return (
    <div>
      <div className="flex justify-end -mt-14">
        <PrimaryButton onClick={() => setIsModalOpen(true)}>
          Generate Report
        </PrimaryButton>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.title} title={card.title} value={card.value} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold">Your reports</p>
        <PrimaryTabs
          tabs={[
            { key: "All Reports", title: "All Reports" },
            { key: "Class Based", title: "Class Based" },
            { key: "Task Based", title: "Task Based" },
          ]}
          selectedKey={activeTab}
          onSelectionChange={(tab) => {
            setActiveTab(tab);
            setPage(1);
          }}
        />
      </div>

      <div className="mt-4">
        <TableDataComponent
          reports={reports}
          onDelete={handleDelete}
          onView={handleView}
          startIndex={(page - 1) * 10}
        />
      </div>

      <PaginationBasic
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AiChatWrapper />

      <GenerateReportModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerateSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
