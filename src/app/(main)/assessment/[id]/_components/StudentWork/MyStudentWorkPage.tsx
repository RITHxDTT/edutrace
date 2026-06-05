"use client";

import {
  AssessmentSubmission,
  AssessmentType,
  SubmissionGrade,
  WorkSession,
} from "@/types/assessment";
import { Award, TickCircle } from "iconsax-react";
import { formatDateLong } from "@/utils/formatDateLong";
import { Pagination } from "@heroui/pagination";
import { useState } from "react";
import GradeScoreCard from "./GradeScoreCard";
import LeftCard from "./LeftCard";

const WORK_SESSIONS_PER_PAGE = 5;

type Props = {
  assessment: AssessmentType;
  sessions: WorkSession[];
  activeSession: WorkSession | null;
  now: number;
  message?: string;
  isPending?: boolean;
  mySubmissions?: AssessmentSubmission[];
};

function getLatestGrade(
  submissions?: AssessmentSubmission[],
): SubmissionGrade | null {
  if (!submissions?.length) return null;
  return (
    [...submissions]
      .sort(
        (a, b) =>
          new Date(b.submittedAt ?? 0).getTime() -
          new Date(a.submittedAt ?? 0).getTime(),
      )
      .find((s) => s.grade?.score != null)?.grade ?? null
  );
}

export function isActiveWorkSession(session?: WorkSession | null) {
  if (!session) return false;
  const status = session.status?.toUpperCase();
  return (
    !session.endedAt ||
    status === "ACTIVE" ||
    status === "IN_PROGRESS" ||
    status === "STARTED"
  );
}

function hasSubmittedWork(status?: string) {
  const normalizedStatus = status?.toUpperCase();
  return normalizedStatus === "SUBMITTED" || normalizedStatus === "RESUBMITTED";
}

export function formatWorkMinutes(minutes: number) {
  const safeMinutes = Math.max(Math.floor(minutes), 0);
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  return `${hours}h ${remainingMinutes}m`;
}

export function formatWorkTimer(totalSeconds: number) {
  const safeSeconds = Math.max(Math.floor(totalSeconds), 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

export function getElapsedWorkSeconds(
  session: WorkSession | null | undefined,
  nowMs: number,
) {
  if (!session?.startedAt) return 0;

  const started = new Date(session.startedAt).getTime();
  const ended = session.endedAt ? new Date(session.endedAt).getTime() : nowMs;

  if (Number.isNaN(started) || Number.isNaN(ended) || ended < started) return 0;
  return Math.floor((ended - started) / 1000);
}

export function getElapsedWorkMinutes(
  session: WorkSession | null | undefined,
  nowMs: number,
) {
  return Math.floor(getElapsedWorkSeconds(session, nowMs) / 60);
}

export function getWorkSessionsTotal(
  sessions: WorkSession[],
  activeSession: WorkSession | null,
  nowMs: number,
) {
  const activeId = activeSession?.workSessionId;

  return sessions.reduce(
    (total, session) => {
      if (activeId && session.workSessionId === activeId) return total;
      return (
        total +
        (session.durationMinutes ?? getElapsedWorkMinutes(session, nowMs))
      );
    },
    activeSession ? getElapsedWorkMinutes(activeSession, nowMs) : 0,
  );
}

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

export function getTodayWorkTotal(
  sessions: WorkSession[],
  activeSession: WorkSession | null,
  nowMs: number,
) {
  const activeId = activeSession?.workSessionId;

  return sessions.reduce(
    (total, session) => {
      if (
        !isToday(session.startedAt, nowMs) ||
        (activeId && session.workSessionId === activeId)
      ) {
        return total;
      }

      return (
        total +
        (session.durationMinutes ?? getElapsedWorkMinutes(session, nowMs))
      );
    },
    activeSession && isToday(activeSession.startedAt, nowMs)
      ? getElapsedWorkMinutes(activeSession, nowMs)
      : 0,
  );
}

export default function MyStudentWorkPage({
  assessment,
  sessions,
  activeSession,
  now,
  message,
  isPending = false,
  mySubmissions,
}: Props) {
  const requiredDailyMinutes = assessment.requiredDailyMinutes ?? 0;
  const currentTime = now;
  const trackedTotalMinutes = getWorkSessionsTotal(
    sessions,
    activeSession,
    currentTime,
  );
  const totalMinutes =
    trackedTotalMinutes || assessment.totalTimeSpentMinutes || 0;
  const trackedTodayMinutes = getTodayWorkTotal(
    sessions,
    activeSession,
    currentTime,
  );
  const liveTodayMinutes =
    trackedTodayMinutes || assessment.timeSpentTodayMinutes || 0;
  const remainingMinutes =
    assessment.remainingDailyMinutes ??
    Math.max(requiredDailyMinutes - liveTodayMinutes, 0);
  const currentStatus = activeSession
    ? "WORKING"
    : (assessment.currentSubmissionStatus ?? "NOT_SUBMITTED");
  const currentSessionSeconds = getElapsedWorkSeconds(
    activeSession,
    currentTime,
  );

  const progressPercent =
    requiredDailyMinutes > 0
      ? Math.min((liveTodayMinutes / requiredDailyMinutes) * 100, 100)
      : 100;
  const progressLabel =
    requiredDailyMinutes > 0
      ? `${Math.min(Math.round((liveTodayMinutes / requiredDailyMinutes) * 100), 100)}%`
      : "100%";
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

  const submissionStatus = assessment.currentSubmissionStatus?.toUpperCase();

  const statusLabel = {
    NOT_YET: "Not Yet",
    IN_PROGRESS: "In Progress",
    SCHEDULED: "Scheduled",
    CLOSED: "Closed",
    ARCHIVED: "Archived",
  };

  const timeStats = (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-[12px] bg-input-field p-4">
        <p className="text-xs font-semibold text-tertiary">Total Time Spent</p>
        <p className="mt-1 text-[22px] font-bold text-primary">
          {formatWorkMinutes(totalMinutes)}
        </p>
      </div>
      <div className="rounded-[12px] bg-input-field p-4">
        <p className="text-xs font-semibold text-tertiary">Time Spent Today</p>
        <p className="mt-1 text-[22px] font-bold text-primary">
          {formatWorkMinutes(liveTodayMinutes)}
        </p>
      </div>
      <div className="rounded-[12px] bg-input-field p-4">
        <p className="text-xs font-semibold text-tertiary">Assessment Status</p>
        <p className="mt-1 text-[22px] font-bold text-primary uppercase">
          {statusLabel[assessment.status]}
        </p>
      </div>
    </div>
  );

  // Graded view — any submission in history with grade data
  const grade = getLatestGrade(mySubmissions);
  if (grade) {
    return (
      <div className="py-4">
        <div className="rounded-[20px] bg-white p-7.5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-sand">
                <Award size={30} color="#DEA20A" />
              </div>
              <div>
                <p className="text-[24px] font-semibold text-primary">
                  Your work has been graded!
                </p>
                <p className="mt-2 max-w-2xl text-sm text-tertiary">
                  Your instructor has evaluated your submission.
                </p>
              </div>
            </div>

            <div className="rounded-[10px] bg-accent-sand px-4 py-2 text-sm font-semibold uppercase text-[#DEA20A]">
              GRADED
            </div>
          </div>

          {grade && <GradeScoreCard grade={grade} assessment={assessment} />}

          {timeStats}
        </div>
      </div>
    );
  }

  if (hasSubmittedWork(submissionStatus)) {
    return (
      <div className="py-4">
        <div className="rounded-[20px] bg-white p-7.5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-light-green">
                <TickCircle size={30} color="#009F15" />
              </div>
              <div>
                <p className="text-[24px] font-semibold text-primary">
                  You have already submitted your work.
                </p>
                <p className="mt-2 max-w-2xl text-sm text-tertiary">
                  Time tracking has stopped. You can wait for your instructor to
                  evaluate your work.
                </p>
              </div>
            </div>

            <div className="rounded-[10px] bg-light-green px-4 py-2 text-sm font-semibold uppercase text-[#009F15]">
              {submissionStatus}
            </div>
          </div>

          {timeStats}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
        {/* Left Card: Stats & Circle Gauge */}

        <LeftCard
          activeSession={activeSession}
          isPending={isPending}
          progressPercent={progressPercent}
          progressLabel={progressLabel}
          remainingMinutes={remainingMinutes}
          currentStatus={currentStatus}
          message={message}
          liveTodayMinutes={liveTodayMinutes}
          requiredDailyMinutes={requiredDailyMinutes}
        />

        {/* Right Card: Timer */}
        <div className="rounded-[20px] bg-white p-7.5 flex flex-col justify-between">
          <div>
            <p className="text-[18px] font-semibold text-primary mb-4">
              Current Session
            </p>
            <div className="rounded-[15px] bg-input-field p-5">
              <p className="text-sm text-tertiary">Current Session Timer</p>
              <p className="text-[40px] font-semibold text-primary">
                {formatWorkTimer(currentSessionSeconds)}
              </p>
              <p className="mt-4 text-sm text-tertiary">Total Time Spent</p>
              <p className="text-[28px] font-semibold text-primary">
                {formatWorkMinutes(
                  activeSession ? trackedTotalMinutes : totalMinutes,
                )}
              </p>
            </div>
          </div>
          {activeSession && (
            <p className="text-xs text-tertiary mt-4">
              This timer keeps running when you switch tabs and ends when you
              leave this assessment.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section: Work Session Log Table */}
      <div className="rounded-[20px] bg-white p-7.5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[18px] font-medium text-primary">
            Work Session Log
          </p>
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
                  const isSessionToday = isToday(
                    session.startedAt,
                    currentTime,
                  );
                  const duration = isActiveWorkSession(session)
                    ? getElapsedWorkMinutes(session, currentTime)
                    : (session.durationMinutes ?? 0);

                  const formatTime = (dateStr?: string) => {
                    if (!dateStr) return "-";
                    const date = new Date(dateStr);
                    return date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  };

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
              classNames={{
                cursor: "bg-linear-purple text-white",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
