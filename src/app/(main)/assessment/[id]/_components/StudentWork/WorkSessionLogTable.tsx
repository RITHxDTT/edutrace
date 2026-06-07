import { Pagination } from "@heroui/pagination";
import { useState } from "react";
import { WorkSession } from "@/types/assessment";
import { formatDateLong } from "@/utils/formatDateLong";
import { formatWorkMinutes, getElapsedWorkMinutes, isActiveWorkSession } from "./MyStudentWorkPage";

const WORK_SESSIONS_PER_PAGE = 5;

function isToday(date: string | undefined, nowMs: number) {
  if (!date) return false;
  const value = new Date(date);
  const today = new Date(nowMs);
  return (
    value.getFullYear() === today.getFullYear() &&
    value.getMonth() === today.getMonth() &&
    value.getDate() === today.getDate()
  );
}

type Props = {
  sessions: WorkSession[];
  now: number;
  liveTodayMinutes: number;
  requiredDailyMinutes: number;
};

export default function WorkSessionTable({
  sessions,
  now,
  liveTodayMinutes,
  requiredDailyMinutes,
}: Props) {
  const totalSessionPages = Math.max(
    Math.ceil(sessions.length / WORK_SESSIONS_PER_PAGE),
    1,
  );
  const [sessionPage, setSessionPage] = useState(1);
  const currentSessionPage = Math.min(sessionPage, totalSessionPages);
  const pagedSessions = sessions.slice(
    (currentSessionPage - 1) * WORK_SESSIONS_PER_PAGE,
    currentSessionPage * WORK_SESSIONS_PER_PAGE,
  );

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-[20px] bg-white p-7.5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[18px] font-medium text-primary">Work Session Log</p>
        {sessions.length > 0 && (
          <p className="text-sm text-tertiary">
            Showing{" "}
            <span className="font-semibold text-primary">
              {(currentSessionPage - 1) * WORK_SESSIONS_PER_PAGE + 1}
            </span>
            {" - "}
            <span className="font-semibold text-primary">
              {Math.min(
                currentSessionPage * WORK_SESSIONS_PER_PAGE,
                sessions.length,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-primary">
              {sessions.length}
            </span>
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-semibold text-tertiary uppercase tracking-wider">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Start Time</th>
              <th className="py-3 px-4">End Time</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {sessions.length > 0 ? (
              pagedSessions.map((session) => {
                const isSessionToday = isToday(session.startedAt, now);
                const duration = isActiveWorkSession(session)
                  ? getElapsedWorkMinutes(session, now)
                  : (session.durationMinutes ?? 0);

                let statusText = "";
                let statusBadgeClass = "";

                if (isSessionToday) {
                  if (liveTodayMinutes < requiredDailyMinutes) {
                    statusText = "Uncompleted";
                    statusBadgeClass = "bg-[#FCD3D3] text-[#FF2056]";
                  } else {
                    statusText = "Completed";
                    statusBadgeClass = "bg-light-green text-[#009F15]";
                  }
                } else {
                  if (session.endedAt) {
                    statusText = "Completed";
                    statusBadgeClass = "bg-light-green text-[#009F15]";
                  } else {
                    statusText = "Active";
                    statusBadgeClass = "bg-light-blue text-[#20AEE6]";
                  }
                }

                return (
                  <tr
                    key={
                      session.workSessionId ??
                      `${session.startedAt}-${session.endedAt}`
                    }
                    className="hover:bg-input-field/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium text-primary">
                      {formatDateLong(session.startedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-tertiary">
                      {formatTime(session.startedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-tertiary">
                      {isActiveWorkSession(session)
                        ? "Active"
                        : formatTime(session.endedAt)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-primary">
                      {formatWorkMinutes(duration)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-xs font-semibold ${statusBadgeClass}`}
                      >
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-tertiary">
                  No work sessions tracked yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalSessionPages > 1 && (
        <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-tertiary">
            Page{" "}
            <span className="font-semibold text-primary">
              {currentSessionPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-primary">
              {totalSessionPages}
            </span>
          </p>
          <Pagination
            showControls
            page={currentSessionPage}
            total={totalSessionPages}
            onChange={setSessionPage}
            classNames={{ cursor: "bg-linear-purple text-white" }}
          />
        </div>
      )}
    </div>
  );
}
