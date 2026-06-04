import { auth } from "@/auth";
import { ClassroomProps } from "../types/classroom";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function getClassRoom() {
  const session = await auth();

  if(!session?.access_token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/classrooms`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch classrooms");
  }
  const data = await res.json();
  return data.payload;
}
