"use server";

import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getTeacherSubjectsAction() {
  const session = await auth();

  if (!session?.access_token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/subjects`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch subjects");
  }

  return data.payload.content;
}