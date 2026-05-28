"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import KpiCard from "./_components/KpiCardComponent";
import GenerateReportModalComponent from "./_components/GenerateModalComponent";
import TableDataComponent, { Report } from "./_components/TableDataReport";
import { PaginationBasic } from "./_components/pagination";
import AiChatWrapper from "../ai/_components/AI/AiChatWrapper";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
const INITIAL_REPORTS: Report[] = [
  {
    reportId: "91000000-0000-4000-8000-000000001602",
    reportName: "Spring Boot Capstone - All Classes Overview",
    reportType: "CLASS",
    displayType: "Class Based",
    period: "May 13, 2026 - May 27, 2026",
    generatedAt: "2026-05-20T03:45:00Z",
    classScope: "ALL",
  },
  {
    reportId: "91000000-0000-4000-8000-000000001603",
    reportName: "OOP Fundamentals - PP Class",
    reportType: "CLASS",
    displayType: "Class Based",
    period: "May 1, 2026 - May 15, 2026",
    generatedAt: "2026-05-15T08:00:00Z",
    classScope: "PP",
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

const REPORTS_PER_PAGE = 5;

export default function ReportPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Reports");
  const [page, setPage] = useState(1);

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

  const totalPages = Math.ceil(filteredReports.length / REPORTS_PER_PAGE);
  const currentPage = Math.min(page, totalPages || 1);
  const pageStartIndex = (currentPage - 1) * REPORTS_PER_PAGE;
  const paginatedReports = useMemo(() => {
    return filteredReports.slice(
      pageStartIndex,
      pageStartIndex + REPORTS_PER_PAGE,
    );
  }, [filteredReports, pageStartIndex]);

  function handleDelete(reportId: string) {
    setReports((prev) => prev.filter((r) => r.reportId !== reportId));
  }

  function handleView(report: Report) {
    const params = new URLSearchParams({
      reportId: report.reportId,
      reportName: report.reportName,
      period: report.period,
    });
    let route: string;
    if (report.reportType === "ASSESSMENT") {
      route = "taskbased";
    } else if (report.classScope && report.classScope !== "ALL") {
      route = "specificClass";
    } else {
      route = "allclasses";
    }
    router.push(`/report/${route}?${params.toString()}`);
  }

  function handleGenerate(report: Report) {
    setReports((prev) => [report, ...prev]);
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
          reports={paginatedReports}
          onDelete={handleDelete}
          onView={handleView}
          startIndex={pageStartIndex}
        />
      </div>
      <div>
        <PaginationBasic
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* <WithDescription/> */}
      <AiChatWrapper />

      <GenerateReportModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
