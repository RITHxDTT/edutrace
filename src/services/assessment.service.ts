import { auth } from "@/auth";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getTeacherAssessments() {
  const session = await auth();

  if (!session?.access_token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/assessments?page=1&size=100`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "*/*",
      },
      cache: "no-store",
    },
  );

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result?.message || "Failed to fetch assessments");
  }

  return result.payload.content;
}
