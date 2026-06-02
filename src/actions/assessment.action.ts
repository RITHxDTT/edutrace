"use server";
import { getAllAssessementService, getAssessmentByIdService } from "@/services/assessment.service";
import { GetAssessmentParams } from "@/types/assessment";

export const getAllAssessmentAction = async (params?: GetAssessmentParams) => {
  const result = await getAllAssessementService(params);
  if (!result.success) {
    return { error: result.message };
  }

  return result.payload.content;
};

export const getAssessmentByIdAction = async (assessmentId: string) => {
  const result = await getAssessmentByIdService(assessmentId);
  if (!result.success) {
    return { error: result.message };
  }

  return result.payload;
}