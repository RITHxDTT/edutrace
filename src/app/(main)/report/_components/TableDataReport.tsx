"use client";

import { Eye, Trash2, FileText, LayoutGrid } from "lucide-react";

export interface Report {
  reportId: string;
  reportName: string;
  reportType: string;
  displayType: string;
  period: string;
  generatedAt: string;
}

interface TableDataComponentProps {
  reports: Report[];
  onDelete: (reportId: string) => void;
  onView: (report: Report) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TableDataComponent({
  reports,
  onDelete,
}: TableDataComponentProps) {
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <FileText size={64} color="currentColor" />
        <p className="mt-4 text-base font-semibold text-gray-700">
          No Report Yet.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          please click on a button above to generate your first report.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="grid grid-cols-[40px_1fr_170px_290px_200px_100px] px-6 py-3 bg-gray-50 border-b border-gray-100">
        {["#", "Report Name", "Type", "Period", "Generated", "Action"].map(
          (col) => (
            <span
              key={col}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
            >
              {col}
            </span>
          ),
        )}
      </div>

      {reports.map((report, index) => {
        const displayId = `RTP-${String(index + 1).padStart(3, "0")}`;
        const isClass = report.reportType === "CLASS";

        return (
          <div
            key={report.reportId}
            className={`grid grid-cols-[40px_1fr_170px_290px_200px_100px] px-6 py-4 items-center hover:bg-gray-50/50 transition-colors ${
              index !== reports.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <span className="text-sm text-gray-500">{index + 1}</span>
            <div className="flex items-center gap-3">
              <div className="text-gray-400 shrink-0">
                <FileText size={24} color="currentColor" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {report.reportName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{displayId}</p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                <LayoutGrid size={12} color="currentColor" />
                {isClass ? "Class" : "Subject"}
              </span>
            </div>
            <span className="text-sm text-gray-600">{report.period}</span>
            <span className="text-sm text-gray-600">
              {formatDate(report.generatedAt)}
            </span>
            <div className="flex items-center gap-3">
              <button
                className="text-gray-400 hover:text-indigo-500 transition-colors"
                title="View report"
              >
                <Eye size={20} color="currentColor" />
              </button>
              <button
                onClick={() => onDelete(report.reportId)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete report"
              >
                <Trash2 size={20} color="currentColor" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
