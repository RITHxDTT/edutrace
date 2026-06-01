"use server";
import { getAllAssessementService, getAssessmentByIdService } from "@/services/assessment.service";
import { GetAssessmentParams } from "@/types/assessment";

export const getAllAssessmentAction = async (params?: GetAssessmentParams) => {
  const result = await getAllAssessementService(params);
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