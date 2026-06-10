"use server";

import { auth } from "@/auth";
import { taskBaseReport as taskBaseReportDto } from "@/types/report";
import { deleteReport, getUserProfile } from "@/services/report.service";
import { revalidatePath } from "next/cache";
import { getReportDetail } from "@/services/report.service";
import { getTeacherSubject } from "@/services/report.service";
// import { getTeacherAssessments } from "@/services/assessment.service";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getReportDetails(reportID: string) {
  
  const session = await auth();
  if (!session?.access_token) {
    throw new Error("Unauthorized");
  }

  
  const res = await getReportDetail(reportID);

  if (!res) {
    throw new Error("Error to fetch data");
  }

  
  return res;
}

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

export async function createClassReport(payload: {
  title: string;
  subjectIds: string[];
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

export async function deleteReportAction(reportId: string) {
  try {
    await deleteReport(reportId);

    revalidatePath("/report");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

export async function getTeacherAssessmentsAction() {
  const session = await auth();

  const token = session?.access_token;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api.yannvanneth.dev";

  const res = await fetch(`${BASE_URL}/api/v1/assessments?page=1&size=100`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
    },

    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch assessments");
  }

  return data.payload.content;
}

export async function getTeacherClassesAction() {
  try {
    const userProfile = await getUserProfile();

    console.log("Fetched User Profile:", userProfile.taughtClassrooms);
    const rawClassrooms = userProfile.taughtClassrooms || [];

    const normalized = rawClassrooms.flatMap((item: any) => {
      if (!item) return [];
      if (typeof item === "string") {
        return {
          classroomId: item,
          className: item,
          classroomAbbre: item,
        };
      }
      return "classrooms" in item ? item.classrooms : item;
    });

    return normalized;
  } catch (error) {
    console.error("Failed to fetch teacher classes:", error);
    throw new Error("Failed to load classes");
  }
}



export async function getTeacherSubjectsAction() {
  try {
    const profile = await getTeacherSubject();
    return profile.taughtSubjects || [];
  } catch (error) {
    console.error("Action error fetching teacher subjects:", error);
    return [];
  }
}