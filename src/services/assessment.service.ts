import headerToken from "@/lib/headerToken";
import { GetAssessmentParams } from "@/types/assessment";

export const getAllAssessementService = async ({
  page = 1,
  size = 10,
  sortBy,
  status,
  type,
  subjectId
}: GetAssessmentParams = {}) => {
  const searchParmas = new URLSearchParams();

  searchParmas.set("page", String(page)); // Cast number to string
  searchParmas.set("size", String(size)); // Cast number to string

  if (sortBy) searchParmas.set("sortBy", sortBy);
  if (status) searchParmas.set("status", status);
  if (type) searchParmas.set("type", type);
  if (subjectId) searchParmas.set("subjectId", subjectId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessments?${searchParmas.toString()}`,
    {
      headers: await headerToken(),
    },
  );
  const result = await res.json();
  if (!res.ok) {
    return { success: false, error: result?.message || "An error has occured." };
  }

  return { success: true, data: result };
};