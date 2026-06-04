"use client";

import {
  endWorkSessionAction,
  getMyWorkSessionsAction,
  startWorkSessionAction,
} from "@/actions/assessment.action";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import {
  AssessmentSubmission,
  AssessmentType,
  WorkSession,
  WorkSessionPayload,
} from "@/types/assessment";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import SubmitAssignmentPage from "./SubmitAssignment/SubmitAssignmentPage";
import MyStudentWorkPage, {
  isActiveWorkSession,
} from "./StudentWork/MyStudentWorkPage";

const pendingEndTimers = new Map<string, number>();

function endWorkSessionOnPageExit(
  assessmentId: string,
  workSessionId?: string,
) {
  const body = JSON.stringify({ assessmentId, workSessionId });
  const url = "/api/work-sessions/end";

  if (navigator.sendBeacon) {
    const payload = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(url, payload)) return;
  }

  void fetch(url, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
    keepalive: true,
  });
}

type Props = {
  assessment: AssessmentType;
  instruction: ReactNode;
  communication: ReactNode;
  workSessions?: WorkSessionPayload | WorkSession[];
  mySubmissions?: AssessmentSubmission[];
};

function normalizeWorkSessions(workSessions?: WorkSessionPayload | WorkSession[]) {
  if (Array.isArray(workSessions)) return workSessions;
  return workSessions?.content ?? [];
}

function hasSubmittedWork(status?: string) {
  const normalizedStatus = status?.toUpperCase();
  return (
    normalizedStatus === "SUBMITTED" ||
    normalizedStatus === "RESUBMITTED" ||
    normalizedStatus === "GRADED"
  );
}

export default function StudentAssessmentTabs({
  assessment,
  instruction,
  communication,
  workSessions,
  mySubmissions,
}: Props) {
  const initialSessions = useMemo(
    () => normalizeWorkSessions(workSessions),
    [workSessions],
  );
  const [sessions, setSessions] = useState<WorkSession[]>(initialSessions);
  const [activeSession, setActiveSession] = useState<WorkSession | null>(() =>
    initialSessions.find((session) => isActiveWorkSession(session)) ?? null,
  );
  const [now, setNow] = useState(0);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const activeSessionRef = useRef<WorkSession | null>(activeSession);
  const hasPostedEndOnPageExitRef = useRef(false);
  const shouldStopTracking = hasSubmittedWork(assessment.currentSubmissionStatus);

  const refreshSessions = useCallback(async () => {
    const result = await getMyWorkSessionsAction(assessment.assessmentId);
    if ("error" in result) return;

    const nextSessions = normalizeWorkSessions(result);
    setSessions(nextSessions);
    setActiveSession(nextSessions.find((session) => isActiveWorkSession(session)) ?? null);
  }, [assessment.assessmentId]);

  useEffect(() => {
    const pendingEndTimer = pendingEndTimers.get(assessment.assessmentId);
    if (pendingEndTimer) {
      window.clearTimeout(pendingEndTimer);
      pendingEndTimers.delete(assessment.assessmentId);
    }

    activeSessionRef.current = activeSession;
  }, [activeSession, assessment.assessmentId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setNow(Date.now()), 0);
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let didUnmount = false;
    const pendingEndTimer = pendingEndTimers.get(assessment.assessmentId);

    if (pendingEndTimer) {
      window.clearTimeout(pendingEndTimer);
      pendingEndTimers.delete(assessment.assessmentId);
    }

    if (shouldStopTracking) {
      if (activeSessionRef.current) {
        void endWorkSessionAction(
          assessment.assessmentId,
          activeSessionRef.current.workSessionId,
        );
        void refreshSessions();
      }

      return () => {
        didUnmount = true;
      };
    }

    const startTimer = window.setTimeout(() => {
      if (activeSessionRef.current) {
        setMessage("Work session is tracking automatically.");
        return;
      }

      startTransition(async () => {
        const result = await startWorkSessionAction(assessment.assessmentId);

        if (!result.success) {
          if (!didUnmount) {
            setMessage(result.error ?? "Unable to start work session.");
          }
          return;
        }

        if (didUnmount) {
          void endWorkSessionAction(
            assessment.assessmentId,
            result.data.workSessionId,
          );
          return;
        }

        setActiveSession(result.data);
        setSessions((previous) => [result.data, ...previous]);
        setMessage("Work session is tracking automatically.");
        await refreshSessions();
      });
    }, 0);

    const handleBeforeUnload = () => {
      if (hasPostedEndOnPageExitRef.current) return;
      hasPostedEndOnPageExitRef.current = true;

      endWorkSessionOnPageExit(
        assessment.assessmentId,
        activeSessionRef.current?.workSessionId,
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);

    return () => {
      didUnmount = true;
      window.clearTimeout(startTimer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);

      const endTimer = window.setTimeout(() => {
        void endWorkSessionAction(assessment.assessmentId);
        pendingEndTimers.delete(assessment.assessmentId);
      }, 1000);

      pendingEndTimers.set(assessment.assessmentId, endTimer);
    };
  }, [assessment.assessmentId, refreshSessions, shouldStopTracking]);

  const tabs = [
    {
      key: "instruction",
      title: "Instruction",
      content: instruction,
    },
    {
      key: "communication",
      title: "Communication",
      content: communication,
    },
    {
      key: "submit-assignment",
      title: "Submit Assignment",
      content: <SubmitAssignmentPage assessment={assessment} mySubmissions={mySubmissions} />,
    },
    {
      key: "student-work",
      title: "Student Work",
      content: (
        <MyStudentWorkPage
          assessment={assessment}
          sessions={sessions}
          activeSession={activeSession}
          now={now}
          message={message}
          isPending={isPending}
          mySubmissions={mySubmissions}
        />
      ),
    },
  ];

  return <PrimaryTabs tabs={tabs} colors="primary" />;
}
