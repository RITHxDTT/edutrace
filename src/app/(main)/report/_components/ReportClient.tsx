
"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import KpiCard from "./KpiCardComponent";
import GenerateReportModalComponent from "./GenerateModalComponent";
import TableDataComponent from "./TableDataReport";
import { PaginationBasic } from "./pagination";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import AiChatWrapper from "../AI/AiChatWrapper";
import { Report } from "../../../../types/report";

interface Classroom {
  classroomId: string;
  classroomName: string;
}

interface ReportClientPageProps {
  initialReports: Report[];
  summary: {
    totalReports: number;
    taskBasedReports: number;
    classBasedReports: number;
    lastGenerated: string;
  };
  totalPages: number;
  currentPage: number;
  activeTab: string;
  classrooms: Classroom[];
}

export default function ReportClientPage({
  initialReports,
  summary,
  totalPages,
  currentPage,
  activeTab,
  classrooms,
}: ReportClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>(initialReports);

  if (initialReports !== reports && initialReports.length > 0) {
    setReports(initialReports);
  }

  function handleParamChange(tabName: string, pageNum: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    params.set("page", String(pageNum));
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleDelete(reportId: string) {
    setReports((prev) => prev.filter((r) => r.reportId !== reportId));
  }

  function handleView(report: Report) {
    const params = new URLSearchParams({
      reportId: report.reportId,
      reportName: report.reportName,
      period: report.period,
    });
    let route = "allclasses";
    if (report.reportType === "ASSESSMENT") {
      route = "taskbased";
    } else if (report.classScope && report.classScope !== "ALL") {
      route = "specificClass";
    }
   router.push(`/report/${report.reportId}`);
  }

  // function handleView(report: Report) {
  //   router.push(`/report/${report.reportId}`);
  // }

  const kpiCards = [
    { title: "Total Reports", value: summary.totalReports },
    { title: "Task Based", value: summary.taskBasedReports },
    { title: "Class Based", value: summary.classBasedReports },
    { title: "Last Generated", value: summary.lastGenerated },
  ];

  const pageStartIndex = (currentPage - 1) * 5;

  return (
    <div>
      <div className="flex justify-between">
        <div>
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
          onSelectionChange={(tab) => handleParamChange(tab, 1)}
        />
      </div>

      <div className="mt-4">
        <TableDataComponent
          reports={reports}
          onDelete={handleDelete}
          onView={handleView}
          startIndex={pageStartIndex}
        />
      </div>

      <div>
        <PaginationBasic
          page={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => handleParamChange(activeTab, p)}
        />
      </div>

      <AiChatWrapper />

      <GenerateReportModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classrooms={classrooms}
        onGenerateSuccess={() => router.refresh()}
      />
    </div>
  );
}
