import { getReportDetail } from "@/services/report.service";

import TaskBasedView from "./_components/TaskBasedView";
import ClassBasedView from "./_components/ClassBasedView";

interface PageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default async function IndividualReportPage({ params }: PageProps) {
  const { reportId } = await params;

  const report = await getReportDetail(reportId).catch(() => null);

  if (!report) {
    return <div className="p-6">Failed to load report</div>;
  }

  const isClassReport = report.reportType === "CLASS";

  if (isClassReport) {
    return <ClassBasedView report={report} />;
  }

  return (
    <TaskBasedView
      summary={report.reportData.summary}
      metadata={{
        reportName: report.reportName,

        generatedAt: report.generatedAt,

        // reportType: report.reportType,
      }}
    />
  );
}
