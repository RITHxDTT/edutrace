import { getReportDetail } from "@/services/report.service";
import TaskBasedView from "../../[reportId]/_components/TaskBasedView";
import ClassBasedView from "../../[reportId]/_components/ClassBasedView";

interface PrintPageProps {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ token?: string }>; 
}

export default async function PrintReportPage({
  params,
  searchParams,
}: PrintPageProps) {
  const { reportId } = await params;
  const { token } = await searchParams;

  
  const report = await getReportDetail(reportId, token).catch(() => null);

  if (!report) {
    return (
      <div className="p-10 text-red-500 font-mono bg-white min-h-screen">
        <h1>Export Render Failure</h1>
        <p>Could not fetch data layers for Report ID: {reportId}</p>
      </div>
    );
  }

  const isClassReport = report.reportType === "CLASS";

  return (
    <main
      id="pdf-report"
      data-ready="true"
      className="bg-white w-full min-h-screen mx-auto text-black"
    >
      <div style={{ width: "100%", display: "block" }}>
        {isClassReport ? (
          <ClassBasedView report={report} isExportMode={true} />
        ) : (
          <TaskBasedView
            summary={report.reportData.summary}
            metadata={{
              reportName: report.reportName,
              generatedAt: report.generatedAt,
              reportId: report.reportId,
            }}
            isExportMode={true}
          />
        )}
      </div>
    </main>
  );
}
