"use server";
import { getAllAssessementService } from "@/services/assessment.service";
import { GetAssessmentParams } from "@/types/assessment";

export const getAllAssessmentAction = async (params?: GetAssessmentParams) => {
  const result = await getAllAssessementService(params);

  if (!result.success) {
    return { success: false, error: result?.error };
  }

  return { success: true, data: result.data?.payload };
};
