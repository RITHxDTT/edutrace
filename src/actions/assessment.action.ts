"use server";
import {
  createAssessmentService,
  endWorkSessionService,
  getAllAssessementService,
  getAssessmentByIdService,
  getAssessmentSubmissionsService,
  getMyAssessmentsService,
  getMyWorkSessionsService,
  startWorkSessionService,
  submitAssignmentService,
  updateAssessmentService,
} from "@/services/assessment.service";
import {
  CreateAssessmentForm,
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

export const getAssessmentByIdAction = async (assessmentId: string) => {
  const result = await getAssessmentByIdService(assessmentId);
  if (!result.success) {
    return { error: result.message };
  }

  return result.payload;
}

export const getAssessmentSubmissionsAction = async (
  assessmentId: string,
  classroomId?: string,
) => {
  const result = await getAssessmentSubmissionsService(assessmentId, classroomId);
  if (!result.success) {
    return { error: result.message };
  }

  return result.payload;
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

export const getMyWorkSessionsAction = async (assessmentId: string) => {
  const result = await getMyWorkSessionsService(assessmentId);
  if (!result.success) {
    return { error: result.message };
  }

  return result.payload;
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
