import { auth } from "@/auth";
import headerToken from "@/lib/headerToken";
import {
  CreateAssessmentForm,
  GradeSubmissionForm,
  GetAssessmentParams,
  SubmitAssignmentForm,
} from "@/types/assessment";

export const getAllAssessementService = async ({
  page = 1,
  size = 6,
  sortBy,
  status,
  type,
  subjectId,
}: GetAssessmentParams = {}) => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(page)); // Cast number to string
  searchParams.set("size", String(size)); // Cast number to string

  if (sortBy) searchParams.set("sortBy", sortBy);
  if (status) searchParams.set("status", status);
  if (type) searchParams.set("type", type);
  if (subjectId) searchParams.set("subjectId", subjectId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessments?${searchParams.toString()}`,
    {
      headers: await headerToken(),
    },
  );
  const result = await res.json();
  return result;
};

export const getAllMyAssessmentService = async ({
  page = 1,
  size = 6,
  sortBy,
  status,
  type,
  subjectId,
}: GetAssessmentParams = {}) => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(page));
  searchParams.set("size", String(size));

  if (sortBy) searchParams.set("sortBy", sortBy);
  if (status) searchParams.set("status", status);
  if (type) searchParams.set("type", type);
  if (subjectId) searchParams.set("subjectId", subjectId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessments/my?${searchParams.toString()}`,
    {
      headers: await headerToken(),
    },
  );

  const result = await res.json();
  return result;
};

export const getMyAssessmentsService = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/my`,
    {
      headers: await headerToken(),
    },
  );

  const result = await res.json();
  return result;
};

export const getAssessmentByIdService = async (assessmentId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessments/${assessmentId}`,
    {
      headers: await headerToken(),
    },
  );
  const result = await res.json();

  return result;
};

export const getAssessmentSubmissionsService = async (assessmentId: string) => {
  const searchParams = new URLSearchParams();

  if (assessmentId) searchParams.set("assessmentId", assessmentId);

  const query = searchParams.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessments/${assessmentId}/submissions?${query}`,
    {
      headers: await headerToken(),
    },
  );
  const result = await res.json();

  return result;
};

export const getSubmissionByIdService = async (submissionId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/submissions/${submissionId}`,
    {
      headers: await headerToken(),
    },
  );

  const result = await res.json();

  if (!res.ok || !result?.success) {
    return {
      success: false,
      error: result?.message || "Failed to get submission details",
    };
  }

  return {
    success: true,
    data: result.payload,
  };
};

export const gradeSubmissionService = async (data: GradeSubmissionForm) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/submissions/grade`,
    {
      method: "POST",
      headers: await headerToken(),
      body: JSON.stringify(data),
    },
  );

  const result = await readAssessmentResponse(res);

  if (!res.ok || !result?.success) {
    return {
      success: false,
      error: result?.message || "Failed to grade submission",
    };
  }

  return {
    success: true,
    data: result.payload,
  };
};

export const submitAssignmentService = async (
  assessmentId: string,
  data: SubmitAssignmentForm,
) => {
  const session = await auth();
  const formData = new FormData();
  const submissionRequest = {
    assessmentId,
    link: data.link || null,
    studentNotes: data.studentNotes || null,
  };

  formData.append("submissionRequest", JSON.stringify(submissionRequest));
  formData.append("file", data.file, data.file.name);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/submissions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: formData,
    },
  );

  const result = await readAssessmentResponse(res);
  if (!res.ok || !result?.success) {
    return {
      success: false,
      error: result?.message || "Failed to submit assignment",
    };
  }
  return {
    success: true,
    data: result.payload,
  };
};
export const getMySubmissionsService = async (assessmentId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessments/${assessmentId}/submissions/my`,
    {
      headers: await headerToken(),
    },
  );
  const result = await res.json();
  return result;
};

export const getMyWorkSessionsService = async (assessmentId: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set("assessmentId", assessmentId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/work-sessions/my?${searchParams.toString()}`,
    {
      headers: await headerToken(),
    },
  );

  const result = await res.json();
  return result;
};

export const getAssessmentWorkSessionsService = async (
  assessmentId: string,
  page = 1,
  size = 10,
) => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("size", String(size));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/work-sessions/assessment/${assessmentId}?${searchParams.toString()}`,
    {
      headers: await headerToken(),
    },
  );

  const result = await res.json();

  if (!res.ok || !result?.success) {
    return {
      success: false,
      error: result?.message || "Failed to get assessment work sessions",
    };
  }

  return {
    success: true,
    data: result.payload,
  };
};

export const startWorkSessionService = async (assessmentId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/work-sessions/start`,
    {
      method: "POST",
      headers: await headerToken(),
      body: JSON.stringify({ assessmentId }),
    },
  );

  const result = await readAssessmentResponse(res);

  if (!res.ok || !result?.success) {
    return {
      success: false,
      error: result?.message || "Failed to start work session",
    };
  }

  return {
    success: true,
    data: result.payload,
  };
};

export const endWorkSessionService = async (
  assessmentId: string,
  workSessionId?: string,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/work-sessions/end`,
    {
      method: "POST",
      headers: await headerToken(),
      body: JSON.stringify({ assessmentId, workSessionId }),
    },
  );

  const result = await readAssessmentResponse(res);

  if (!res.ok || !result?.success) {
    return {
      success: false,
      error: result?.message || "Failed to end work session",
    };
  }

  return {
    success: true,
    data: result.payload,
  };
};

function createAssessmentFormData(data: CreateAssessmentForm) {
  const formData = new FormData();
  const { files, ...assessmentRequest } = data;

  formData.append("assessmentRequest", JSON.stringify(assessmentRequest));

  files.forEach((file) => {
    formData.append("files", file);
  });

  return formData;
}

async function readAssessmentResponse(res: Response) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { message: text };
  }
}

export const createAssessmentService = async (data: CreateAssessmentForm) => {
  const session = await auth();
  const formData = createAssessmentFormData(data);

  console.log(formData)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: formData,
    },
  );

  console.log(res)

  const result = await readAssessmentResponse(res);

  if (!res.ok || !result?.success) {
    return {
      success: false,
      error: result?.message || "Failed to create assessment",
    };
  }

  return {
    success: true,
    data: result.payload,
  };
};

export const updateAssessmentService = async (
  assessmentId: string,
  data: CreateAssessmentForm,
) => {
  const session = await auth();
  const formData = createAssessmentFormData(data);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessments/${assessmentId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: formData,
    },
  );

  const result = await readAssessmentResponse(res);

  if (!res.ok || !result?.success) {
    return {
      success: false,
      error: result?.message || "Failed to update assessment",
    };
  }

  return {
    success: true,
    data: result.payload,
  };
};
