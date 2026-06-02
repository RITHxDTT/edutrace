import { getReportSummaryById, reportMetadata } from "@/services/reportService";


import TaskBasedView from "./_components/TaskBasedView"; 
import ClassBasedView from "./_components/ClassBasedView";

interface PageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default async function IndividualReportPage({ params }: PageProps) {
  const { reportId } = await params;

  
  const [summary, metadata] = await Promise.all([
    getReportSummaryById(reportId).catch(() => null),
    reportMetadata(reportId).catch(() => null),
  ]);

  
  const isClassReport = metadata?.reportType === "CLASS";

  
  if (isClassReport) {
    return <ClassBasedView summary={summary} metadata={metadata} />;
  }

  
  return <TaskBasedView summary={summary} metadata={metadata} />;
}