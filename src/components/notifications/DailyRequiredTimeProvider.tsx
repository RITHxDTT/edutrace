"use client";

import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getAllMyAssessmentAction, getMyWorkSessionsAction } from "@/actions/assessment.action";
import { useDailyRequiredStore } from "@/stores/useDailyRequiredStore";
import type { AssessmentType } from "@/types/assessment";

const POLL_MS = 2 * 60 * 1000;

type WorkSession = {
  startedAt?: string;
  endedAt?: string;
  durationMinutes?: number;
};

function normalizePayload(result: unknown): AssessmentType[] {
  if (!result || typeof result !== "object") return [];
  if ("error" in (result as object)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[DailyRequired] fetch error:", (result as { error: unknown }).error);
    }
    return [];
  }
  if (Array.isArray(result)) return result as AssessmentType[];
  const r = result as { content?: AssessmentType[] };
  return r.content ?? [];
}

function normalizeSessions(result: unknown): WorkSession[] {
  if (!result || typeof result !== "object") return [];
  if ("error" in (result as object)) return [];
  if (Array.isArray(result)) return result as WorkSession[];
  const r = result as { content?: WorkSession[] };
  return r.content ?? [];
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function calcTodayMinutes(sessions: WorkSession[]): number {
  return sessions.reduce((total, s) => {
    if (!s.startedAt || !isToday(s.startedAt)) return total;
    if (s.durationMinutes != null) return total + s.durationMinutes;
    // Ongoing session with no duration yet — calculate from startedAt to now
    const start = new Date(s.startedAt).getTime();
    const end = s.endedAt ? new Date(s.endedAt).getTime() : Date.now();
    return total + Math.floor((end - start) / 60000);
  }, 0);
}

export default function DailyRequiredTimeProvider() {
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isStudent = role === "student";
  const { setAssessments, clear, refreshCounter } = useDailyRequiredStore();

  const fetchAndUpdate = useCallback(async () => {
    try {
      const raw = await getAllMyAssessmentAction({ status: "IN_PROGRESS", size: 100 });
      const all = normalizePayload(raw);
      const withRequirement = all.filter((a) => (a.requiredDailyMinutes ?? 0) > 0);

      // Fetch work sessions for all qualifying assessments in parallel
      const sessionResults = await Promise.all(
        withRequirement.map((a) => getMyWorkSessionsAction(a.assessmentId)),
      );

      const incomplete = withRequirement.filter((a, i) => {
        const todayMinutes = calcTodayMinutes(normalizeSessions(sessionResults[i]));
        return todayMinutes < (a.requiredDailyMinutes ?? 0);
      });

      if (process.env.NODE_ENV === "development") {
        console.log(
          "[DailyRequired] total IN_PROGRESS:", all.length,
          "| with requiredDailyMinutes:", withRequirement.length,
          "| still incomplete today:", incomplete.length,
        );
      }

      setAssessments(
        incomplete.map((a) => ({ assessmentId: a.assessmentId, title: a.title })),
      );
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[DailyRequired] unexpected error:", err);
      }
    }
  }, [setAssessments]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!isStudent) { clear(); return; }
    fetchAndUpdate();
  }, [status, isStudent, fetchAndUpdate, clear]);

  useEffect(() => {
    if (status !== "authenticated" || !isStudent || refreshCounter === 0) return;
    fetchAndUpdate();
  }, [refreshCounter, status, isStudent, fetchAndUpdate]);

  useEffect(() => {
    if (status !== "authenticated" || !isStudent) return;
    const interval = setInterval(fetchAndUpdate, POLL_MS);
    const onFocus = () => fetchAndUpdate();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [status, isStudent, fetchAndUpdate]);

  return null;
}
