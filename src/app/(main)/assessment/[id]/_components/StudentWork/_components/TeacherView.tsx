import { useState } from "react";
import FolderCard from "../Foldercard";
import { MOCK_STUDENTS, MOCK_ACTIVITY_LOG } from "../mockupData";
import { TOTAL_PAGES } from "../constant";
import { ChevronLeftIcon, ChevronRightIcon, SubmitSvg, DocumentSvg } from "../_components/icon";
import { ClassFilter } from "./ClassFilter";

export function TeacherView() {
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState<"All Classes" | "Class A" | "Class B" | "Class C">("All Classes");

  const handedInCount = MOCK_STUDENTS.filter((s) => s.status === "Handed In").length;

  return (
    <>
      {/* Main Panel */}
      <div className="bg-white rounded-2xl border border-[#e8eaf2] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f1f8]">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-primary">
              Submitted Work
            </h2>

            <span className="w-px h-4 bg-gray-200" />

            <span className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-primary">
                {handedInCount}
              </span>
              <span className="text-xs font-medium text-border-focus">
                Handed In
              </span>
            </span>

            <span className="w-px h-4 bg-gray-200" />

            <span className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-primary">
                {MOCK_STUDENTS.length}
              </span>
              <span className="text-xs font-medium text-border-focus">
                Assigned
              </span>
            </span>
          </div>

          <ClassFilter value={filterValue} onChange={setFilterValue} />
        </div>

        {/* Folder Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 p-6">
          {MOCK_STUDENTS.map((student) => (
            <FolderCard key={student.id} {...student} />
          ))}
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-[#f0f1f8]">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-border-focus rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon /> Previous
          </button>

          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 text-sm rounded-lg transition-colors
                ${
                  page === n
                    ? "bg-[#5b52e8] text-white font-semibold"
                    : "text-border-focus font-medium hover:bg-gray-50"
                }`}
            >
              {n}
            </button>
          ))}

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-border-focus rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
            onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          >
            Next <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-2xl p-5 flex flex-col border border-[#e8eaf2]">
        <h2 className="text-base font-bold text-primary">
          Activity Log
        </h2>

        <div className="h-px bg-[#f0f1f8] my-4" />

        <div className="w-full flex flex-col gap-4">
          {MOCK_ACTIVITY_LOG.map((log) => (
            <div key={log.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background:
                      log.type === "submit"
                        ? "rgba(34,197,94,0.15)"
                        : "#1e2235",
                  }}
                >
                  {log.type === "submit" ? <SubmitSvg /> : <DocumentSvg />}
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-primary leading-5">
                  <strong className="font-semibold">
                    {log.student}
                  </strong>
                  {log.action ? ` ${log.action}` : ""}
                </p>

                <p className="text-xs font-medium text-border-focus">
                  {log.file}
                </p>

                <p className="text-[11px] font-medium text-border-focus/80">
                  {log.datetime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}