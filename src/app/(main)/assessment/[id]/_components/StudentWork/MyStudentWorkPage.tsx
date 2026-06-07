import {
  AssessmentSubmission,
  AssessmentType,
  SubmissionGrade,
  WorkSession,
} from "@/types/assessment";
import { Award, TickCircle } from "iconsax-react";
import GradeScoreCard from "./GradeScoreCard";
import TrackSessionCard from "./TrackSessionCard";
import WorkSessionTable from "./WorkSessionLogTable";
import CurrentSessionCard from "./CurrentSessionCard";

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

        <TrackSessionCard
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
        <CurrentSessionCard
          activeSession={activeSession}
          currentSessionSeconds={currentSessionSeconds}
          trackedTotalMinutes={trackedTotalMinutes}
          totalMinutes={totalMinutes}
        />
      </div>

      {/* Bottom Section: Work Session Log Table */}
      <WorkSessionTable
        sessions={sessions}
        now={currentTime}
        liveTodayMinutes={liveTodayMinutes}
        requiredDailyMinutes={requiredDailyMinutes}
      />
    </div>
  );
}
