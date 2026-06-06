import { getReportDetail } from "@/services/report.service";
import TaskBasedView from "../../[reportId]/_components/TaskBasedView";

export default async function PrintReportPage({
  params,
}: {
  params: { reportId: string };
}) {
  const report = await getReportDetail(params.reportId).catch(() => null);

  if (!report) {
    return <div className="p-6">Report not found</div>;
  }

  const isClassReport = report.reportType === "CLASS";

  return (
    <div
      id="pdf-report"
      className="bg-white text-black w-full min-h-screen p-6"
    >
      {isClassReport ? (
        <div>
          
          <h1 className="text-xl font-bold mb-4">
            {report.reportName}
          </h1>

          
          <div>
          
          </div>
        </div>
      ) : (
        <div>
          
          <h1 className="text-xl font-bold mb-4">
            {report.reportName}
          </h1>

          <div>
            
            <TaskBasedView
              summary={report.reportData.summary}
              metadata={{
                reportName: report.reportName,
                generatedAt: report.generatedAt,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}