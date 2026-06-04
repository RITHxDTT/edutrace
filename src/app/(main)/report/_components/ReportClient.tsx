"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import KpiCard from "./KpiCardComponent";
import GenerateReportModalComponent from "./GenerateModalComponent";
import TableDataComponent from "./TableDataReport";
import { PaginationBasic } from "./pagination";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import AiChatWrapper from "../AI/AiChatWrapper";

import { Report, ReportSummary } from "../../../../types/report";
import { deleteReportAction } from "@/actions/report.action";

interface Classroom {
  classroomId: string;
  classroomName: string;
}

interface ReportClientPageProps {
  initialReports: Report[];
  summary: ReportSummary;
  totalPages: number;
  currentPage: number;
  activeTab: string;
  classrooms: Classroom[];
}

export default function ReportClientPage({
  initialReports,
  summary: initialSummary,
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

  const [summary, setSummary] =
    useState<ReportSummary>(initialSummary);

  
  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  useEffect(() => {
    setSummary(initialSummary);
  }, [initialSummary]);

  function handleParamChange(tabName: string, pageNum: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    params.set("page", String(pageNum));
    router.push(`${pathname}?${params.toString()}`);
  }

  async function handleDelete(reportId: string) {
    console.log("Client delete:", reportId);

    const result = await deleteReportAction(reportId);

    if (!result.success) {
      console.error(result.message);
      return;
    }

    
    setReports((prev) =>
      prev.filter((r) => r.reportId !== reportId)
    );

    setSummary((prev) => ({
      ...prev,
      totalReports: prev.totalReports - 1,
    }));
  }

  function handleView(report: Report) {
    router.push(`/report/${report.reportId}`);
  }

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
            Generate and review performance reports.
          </p>
        </div>

        <PrimaryButton onClick={() => setIsModalOpen(true)}>
          Generate Report
        </PrimaryButton>
      </div>

      
      <div className="mt-5 grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <KpiCard
            key={card.title}
            title={card.title}
            value={card.value}
          />
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
          onSelectionChange={(tab) =>
            handleParamChange(tab, 1)
          }
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

      
      <PaginationBasic
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(p) =>
          handleParamChange(activeTab, p)
        }
      />

      <AiChatWrapper />

      
      <GenerateReportModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // classrooms={classrooms}
        onGenerateSuccess={() => router.refresh()}
      />
    </div>
  );
}