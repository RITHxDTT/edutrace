"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import KpiCard from "./KpiCardComponent";
import GenerateReportModalComponent from "./GenerateModalComponent";
import TableDataComponent from "./TableDataReport";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import AiChatWrapper from "../AI/AiChatWrapper";
import NavbarTitle from "@/components/Topbar/NavbarTitle";

import { Pagination } from "@heroui/pagination";

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
  const [summary, setSummary] = useState<ReportSummary>(initialSummary);

  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  useEffect(() => {
    setSummary(initialSummary);
  }, [initialSummary]);

  function handleParamChange(tabName: string, pageNum: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);

    if (pageNum <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(pageNum));
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  async function handleDelete(reportId: string) {
    const result = await deleteReportAction(reportId);

    if (!result.success) return;

    setReports((prev) => prev.filter((r) => r.reportId !== reportId));

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
      <NavbarTitle title="Report" override />
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl md:text-[32px] font-medium">Report</p>
          <p className="text-foreground/50">
            Generate and review performance reports.
          </p>
        </div>

        <PrimaryButton
          onClick={() => setIsModalOpen(true)}
          className="h-[45px] w-full sm:w-auto"
        >
          Generate Report
        </PrimaryButton>
      </div>

      {/* KPI */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.title} title={card.title} value={card.value} />
        ))}
      </div>

      {/* TABS */}
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

      {/* TABLE */}
      <div className="mt-4">
        <TableDataComponent
          reports={reports}
          onDelete={handleDelete}
          onView={handleView}
          startIndex={pageStartIndex}
        />
      </div>

      {/* HERO UI PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between rounded-[20px] bg-white px-6 py-4">
          <p className="text-sm text-foreground/60">
            Page{" "}
            <span className="font-semibold text-foreground">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {totalPages}
            </span>
          </p>

          <Pagination
            showControls
            page={currentPage}
            total={totalPages}
            onChange={(page) => handleParamChange(activeTab, page)}
            classNames={{
              cursor: "bg-linear-purple text-white",
            }}
          />
        </div>
      )}

      {/* AI CHAT */}
      <AiChatWrapper />

      {/* MODAL */}
      <GenerateReportModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerateSuccess={() => router.refresh()}
      />
    </div>
  );
}