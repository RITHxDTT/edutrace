import {
  getAllSubjectService,
  getSubjectByIdService,
} from "@/services/subject.service";

export const getSubjectByIdAction = async (subjectId?: string) => {
  if (!subjectId) return;

  const result = await getSubjectByIdService(subjectId);

  if (!result.sucess) {
    return { error: result.message };
  }

  return result.payload.conten;
};

export const getAllSubjectAction = async () => {
  const result = await getAllSubjectService();

  if (!result.success) {
    return { error: result.message };
  }

  return result.payload.content;
};
