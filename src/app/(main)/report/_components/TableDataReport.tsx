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

    try {
      await onDelete(pendingDelete.reportId);
    } catch (err) {
      console.error(err);
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
          Please click above to generate your first report.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop Header */}

        <div
          className="
          hidden md:grid

          grid-cols-[50px_minmax(180px,2fr)_110px_1fr_120px_80px]
          lg:grid-cols-[60px_minmax(220px,2fr)_140px_180px_150px_100px]

          gap-3
          px-4 lg:px-6
          py-3

          bg-gray-50
          border-b
          border-gray-100
        "
        >
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

          const isAllClass = isClass && report.classScope === "ALL";

          return (
            <div key={report.reportId}>
              {/* Desktop Row */}

              <div
                className={`
                hidden md:grid

                grid-cols-[50px_minmax(180px,2fr)_110px_1fr_120px_80px]
                lg:grid-cols-[60px_minmax(220px,2fr)_140px_180px_150px_100px]

                gap-3
                px-4 lg:px-6
                py-4
                items-center

                hover:bg-gray-50
                transition-colors

                ${
                  index !== reports.length - 1 ? "border-b border-gray-100" : ""
                }
              `}
              >
                <span className="text-sm text-gray-400">{rowNumber}</span>

                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={22} className="text-gray-400 shrink-0" />

                  <div className="min-w-0 overflow-hidden">
                    <p className="font-semibold truncate">
                      {report.reportName}
                    </p>

                    <p className="text-xs text-gray-400">{displayId}</p>
                  </div>
                </div>

                <div>
                  <span
                    className={`
                    inline-flex
                    items-center
                    gap-1
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium

                    ${
                      isClass
                        ? "bg-blue-50 text-blue-600"
                        : "bg-indigo-50 text-indigo-600"
                    }
                  `}
                  >
                    <LayoutGrid size={12} />

                    {isClass ? (isAllClass ? "All Class" : "Class") : "Subject"}
                  </span>
                </div>

                <span className="text-sm truncate min-w-0">
                  {report.period}
                </span>

                <span className="text-sm">
                  {formatDate(report.generatedAt)}
                </span>

                <div className="flex gap-3">
                  <button onClick={() => onView(report)}>
                    <Eye
                      size={18}
                      className="text-gray-400 hover:text-indigo-500"
                    />
                  </button>

                  <button onClick={() => setPendingDelete(report)}>
                    <Trash2
                      size={18}
                      className="text-gray-400 hover:text-red-500"
                    />
                  </button>
                </div>
              </div>

              {/* Mobile Card */}

              <div
                className={`
                md:hidden

                p-3 sm:p-4

                ${
                  index !== reports.length - 1 ? "border-b border-gray-100" : ""
                }
              `}
              >
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {report.reportName}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">{displayId}</p>
                  </div>

                  <span className="text-xs text-gray-400 shrink-0">
                    #{rowNumber}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-sm text-gray-600">{report.period}</span>

                  <span className="text-sm text-gray-400">•</span>

                  <span className="text-sm text-gray-600">
                    {formatDate(report.generatedAt)}
                  </span>
                </div>

                <div
                  className="
                  flex
                  flex-wrap
                  justify-between
                  items-center
                  gap-3
                  mt-4
                "
                >
                  <span
                    className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs

                    ${
                      isClass
                        ? "bg-blue-50 text-blue-600"
                        : "bg-indigo-50 text-indigo-600"
                    }
                  `}
                  >
                    {isClass ? (isAllClass ? "All Class" : "Class") : "Subject"}
                  </span>

                  <div className="flex gap-5">
                    <button onClick={() => onView(report)}>
                      <Eye size={18} className="text-indigo-500" />
                    </button>

                    <button onClick={() => setPendingDelete(report)}>
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
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
