"use server";

import { auth } from "@/auth";
import { taskBaseReport as taskBaseReportDto } from "@/types/report";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function taskBaseReport(payload: taskBaseReportDto) {
  const session = await auth();
  if (!session?.access_token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/reports/task-based`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to generate task base report");
  }

  return data.payload; 
}

// Keeping your class report method intact
export async function createClassReport(payload: {
  title: string;
  subjectId: string;
  classroomIds: string[];
  startDate: string;
  endDate: string;
}) {
  const session = await auth();
  const res = await fetch(`${API_URL}/reports/class-based`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to generate class report");
  }
  return result.payload;
}