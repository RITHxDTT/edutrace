import { getMyReports } from "@/services/report.service";
import { getClassRoom } from "../../../services/classroom.service";
import ReportClientPage from "./_components/ReportClient";
import { Report } from "../../../types/report";

interface PageProps {
  searchParams: Promise<{
    tab?: string;
    page?: string;
  }>;
}

export default async function ReportPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || "All Reports";
  const currentPage = Number(resolvedParams.page) || 1;
  const pageSize = 5;

  let apiType: "ALL" | "CLASS" | "ASSESSMENT" = "ALL";
  if (activeTab === "Class Based") apiType = "CLASS";
  if (activeTab === "Task Based") apiType = "ASSESSMENT";

  
  const [reportData, classroomsList] = await Promise.all([
    getMyReports({ type: apiType, page: currentPage, size: pageSize }).catch(() => null),
    getClassRoom({}).catch(() => []),
  ]);

  const reportsList: Report[] = reportData?.reports || [];
  const totalElements = reportData?.totalElements || 0;
  const totalPages = reportData?.totalPages || 1;

  
  const apiSummary = reportData?.summary;

  const summary = {
    totalReports: apiSummary?.totalReports ?? totalElements,
    taskBasedReports: apiSummary?.taskBasedReports ?? 0,
    classBasedReports: apiSummary?.classBasedReports ?? 0,
    lastGenerated: apiSummary?.lastGenerated 
      ? new Date(apiSummary.lastGenerated).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
  };

  return (
    <ReportClientPage
      initialReports={reportsList}
      summary={summary}
      totalPages={totalPages}
      currentPage={currentPage}
      activeTab={activeTab}
      classrooms={classroomsList || []} 
    />
  );
}