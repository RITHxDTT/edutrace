"use client";

import { useState } from "react";
import { Eye, Trash2, FileText, LayoutGrid } from "lucide-react";
import ActionModal from "../modal/_components/action";

import { Report } from "../../../../types/report";



interface TableDataComponentProps {
  reports: Report[];
  onDelete: (reportId: string) => void; 
  onView: (report: Report) => void;
  startIndex?: number;
}


function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TableDataComponent({
  reports,
  onDelete,
  onView,
  startIndex = 0,
}: TableDataComponentProps) {
  const [pendingDelete, setPendingDelete] = useState<Report | null>(null);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;

    console.log("Table: confirm delete", pendingDelete.reportId);

    try {
      await onDelete(pendingDelete.reportId);
    } catch (err) {
      console.error("Delete failed:", err);
    }

    setPendingDelete(null);
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <FileText size={64} className="text-gray-300" />
        <p className="mt-4 text-base font-semibold text-gray-700">
          No Report Yet.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Please click on a button above to generate your first report.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        
        <div className="grid grid-cols-[60px_1fr_150px_250px_180px_100px] px-6 py-3 bg-gray-50 border-b border-gray-100">
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
          const rowNumber = startIndex + index + 1;
          const displayId = `RTP-${String(rowNumber).padStart(3, "0")}`;
          const isClass = report.reportType === "CLASS";

          return (
            <div
              key={report.reportId}
              className={`grid grid-cols-[60px_1fr_150px_250px_180px_100px] px-6 py-4 items-center hover:bg-gray-50/50 transition-colors ${
                index !== reports.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-sm font-medium text-gray-400">
                {rowNumber}
              </span>

              <div className="flex items-center gap-3 min-w-0">
                <div className="text-gray-400 shrink-0">
                  <FileText size={22} />
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                    {report.reportName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{displayId}</p>
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isClass
                      ? "bg-blue-50 text-blue-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  <LayoutGrid size={12} />
                  {isClass ? "Class" : "Subject"}
                </span>
              </div>

              <span className="text-sm text-gray-600 truncate">
                {report.period}
              </span>

              <span className="text-sm text-gray-600">
                {formatDate(report.generatedAt)}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onView(report)}
                  className="text-gray-400 hover:text-indigo-500 transition-colors"
                  title="View report"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => setPendingDelete(report)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete report"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ActionModal
        isOpen={!!pendingDelete}
        reportName={pendingDelete?.reportName ?? ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
