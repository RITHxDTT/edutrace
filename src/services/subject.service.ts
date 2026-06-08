import headerToken from "@/lib/headerToken";

export const getSubjectByIdService = async (subjectId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/subjects/${subjectId}`,
    {
      headers: await headerToken(),
    },
  );

  const result = await res.json();

  return result;
};

export const getAllSubjectService = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/subjects`, {
        headers: await headerToken()
    }
  );
  
  const result = await res.json();

  return result;
};
