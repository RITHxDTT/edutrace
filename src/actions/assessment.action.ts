"use server";
import {
  createAssessmentService,
  endWorkSessionService,
  gradeSubmissionService,
  getAllAssessementService,
  getAssessmentWorkSessionsService,
  getAssessmentByIdService,
  getAssessmentSubmissionsService,
  getMyAssessmentsService,
  getMySubmissionsService,
  getMyWorkSessionsService,
  getSubmissionByIdService,
  startWorkSessionService,
  submitAssignmentService,
  updateAssessmentService,
  getAllMyAssessmentService,
} from "@/services/assessment.service";
import {
  CreateAssessmentForm,
  GradeSubmissionForm,
  GetAssessmentParams,
  SubmitAssignmentForm,
} from "@/types/assessment";

function normalizeSubmitAssignmentData(data: FormData): SubmitAssignmentForm {
  const file = data.get("file");
  const link = data.get("link");
  const studentNotes = data.get("studentNotes");

  if (!(file instanceof File)) {
    throw new Error("Submission file is required.");
  }

  return {
    file,
    link: typeof link === "string" && link.trim() ? link.trim() : null,
    studentNotes:
      typeof studentNotes === "string" && studentNotes.trim()
        ? studentNotes.trim()
        : null,
  };
}

export const getAllAssessmentAction = async (params?: GetAssessmentParams) => {
  const result = await getAllAssessementService(params);
  if (!result.success) {
    return { error: result.message };
  }

  return result.payload;
};

export const getMyAssessmentsAction = async () => {
  const result = await getMyAssessmentsService();
  if (!result.success) {
    return { error: result.message };
  }

  return result.payload;
};

export const getAllMyAssessmentAction = async (params?: GetAssessmentParams) => {
  const result = await getAllMyAssessmentService(params);
  if (!result.success) {
    return { error: result.message };
  }

  return result.payload;
}

export const getAssessmentByIdAction = async (assessmentId: string) => {
  const result = await getAssessmentByIdService(assessmentId);
  if (!result.success) {
    return { error: result.message };
  }
  console.log(result)
  return result.payload;
}

export const getAssessmentSubmissionsAction = async (
  assessmentId: string,
) => {
  const result = await getAssessmentSubmissionsService(assessmentId);
  if (!result.success) {
    return { error: result.message };
  }
  return result.payload;
};

export const getSubmissionByIdAction = async (submissionId: string) => {
  try {
    const result = await getSubmissionByIdService(submissionId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get submission details error:", error);

    return {
      success: false,
      error: "Something went wrong while getting submission details.",
    };
  }
};

export const gradeSubmissionAction = async (data: GradeSubmissionForm) => {
  try {
    const result = await gradeSubmissionService(data);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Grade submission error:", error);

    return {
      success: false,
      error: "Something went wrong while grading submission.",
    };
  }
};

export const submitAssignmentAction = async (
  assessmentId: string,
  data: FormData,
) => {

  try {
    const result = await submitAssignmentService(
      assessmentId,
      normalizeSubmitAssignmentData(data),
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Submit assignment error:", error);

    return {
      success: false,
      error: "Something went wrong while submitting assignment.",
    };
  }
};

export const getMySubmissionsAction = async (assessmentId: string) => {
  const result = await getMySubmissionsService(assessmentId);
  if (!result.success) {
    return { error: result.message };
  }

  // The /submissions/my endpoint nests student info under `student` and grader info
  // under `grade.grader`. Normalise to flat fields so the rest of the UI works uniformly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalized = (result.payload as any[] ?? []).map((item: any) => ({
    ...item,
    studentId: item.studentId ?? item.student?.userId,
    studentName: item.studentName ?? item.student?.fullName,
    studentProfileImageUrl: item.studentProfileImageUrl ?? item.student?.profileImageUrl,
    classroomId: item.classroomId ?? item.student?.classroom?.classroomId,
    classroomName: item.classroomName ?? item.student?.classroom?.className,
    classroomAbbre: item.classroomAbbre ?? item.student?.classroom?.classroomAbbre,
    grade: item.grade
      ? {
          ...item.grade,
          graderName: item.grade.graderName ?? item.grade.grader?.fullName,
        }
      : undefined,
  }));

  return normalized;
};

export const getMyWorkSessionsAction = async (assessmentId: string) => {
  const result = await getMyWorkSessionsService(assessmentId);
  if (!result.success) {
    return { error: result.message };
  }

  return result.payload;
};

export const getAssessmentWorkSessionsAction = async (
  assessmentId: string,
  page = 1,
  size = 10,
) => {
  try {
    const result = await getAssessmentWorkSessionsService(assessmentId, page, size);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get assessment work sessions error:", error);

    return {
      success: false,
      error: "Something went wrong while getting assessment work sessions.",
    };
  }
};

export const startWorkSessionAction = async (assessmentId: string) => {
  try {
    const result = await startWorkSessionService(assessmentId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Start work session error:", error);

    return {
      success: false,
      error: "Something went wrong while starting the work session.",
    };
  }
};

export const endWorkSessionAction = async (
  assessmentId: string,
  workSessionId?: string,
) => {
  try {
    const result = await endWorkSessionService(assessmentId, workSessionId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("End work session error:", error);

    return {
      success: false,
      error: "Something went wrong while ending the work session.",
    };
  }
};

export const createAssessmentAction = async (data: CreateAssessmentForm) => {
  try {
    const result = await createAssessmentService(data);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Create assessment error:", error);

    return {
      success: false,
      error: "Something went wrong while creating assessment.",
    };
  }
};

export const updateAssessmentAction = async (
  assessmentId: string,
  data: CreateAssessmentForm,
) => {
  try {
    const result = await updateAssessmentService(assessmentId, data);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Update assessment error:", error);

    return {
      success: false,
      error: "Something went wrong while updating assessment.",
    };
  }
};
