import { createAssessmentAction, updateAssessmentAction } from "@/actions/assessment.action";
import { AssessmentType, CreateAssessmentForm } from "@/types/assessment";
import { useMemo, useState } from "react";

const defaultForm: CreateAssessmentForm = {
  title: "",
  description: "",
  assessmentType: "ASSIGNMENT",
  subjectId: "",
  classroomIds: [],
  startAt: "",
  dueAt: "",
  maxScore: 10,
  requiredDailyMinutes: 5,
  allowLateSubmissions: false,
  gradingRubric: "",
  files: [],
  createdTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

function toAssessmentForm(assessment?: AssessmentType): CreateAssessmentForm {
  if (!assessment) {
    return {
      ...defaultForm,
      classroomIds: [],
      files: [],
      createdTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  const classroomIds =
    assessment.classroomIds ??
    assessment.classrooms?.map((classroom) => classroom.classroomId) ??
    [];

  return {
    title: assessment.title ?? "",
    description: assessment.description ?? "",
    assessmentType: assessment.assessmentType ?? "ASSIGNMENT",
    subjectId: assessment.subject.subjectId ?? "",
    classroomIds,
    startAt: assessment.startAt ?? "",
    dueAt: assessment.dueAt ?? "",
    maxScore: assessment.maxScore ?? 10,
    requiredDailyMinutes: assessment.requiredDailyMinutes ?? 5,
    allowLateSubmissions: false,
    gradingRubric: Array.isArray(assessment.gradingRubric)
      ? assessment.gradingRubric.join(";")
      : assessment.gradingRubric ?? "",
    files: [],
    createdTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

type UseCreateAssessmentOptions = {
  assessment?: AssessmentType;
  assessmentId?: string;
  mode?: "create" | "edit";
  onSuccess?: () => void;
};

export function useCreateAssessment({
  assessment,
  assessmentId,
  mode = "create",
  onSuccess,
}: UseCreateAssessmentOptions = {}) {
  const initialForm = useMemo(() => toAssessmentForm(assessment), [assessment]);
  const [form, setForm] = useState<CreateAssessmentForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof CreateAssessmentForm>(
    key: K,
    value: CreateAssessmentForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () =>
    setForm(mode === "edit" ? initialForm : toAssessmentForm());

  const validate = (nextForm: CreateAssessmentForm) => {
    if (!nextForm.title.trim()) return "Please enter an assessment title.";
    if (!nextForm.assessmentType) return "Please select an assessment type.";
    if (!nextForm.subjectId) return "Please select a topic.";
    if (!nextForm.startAt || !nextForm.dueAt) return "Please select an assessment date range.";
    if (mode === "create" && nextForm.classroomIds.length === 0) {
      return "Please select at least one classroom.";
    }
    if (nextForm.maxScore <= 0) return "Set point must be greater than 0.";
    if (nextForm.requiredDailyMinutes <= 0) {
      return "Daily required minutes must be greater than 0.";
    }

    return null;
  };

  const submit = async (overrides?: Partial<CreateAssessmentForm>) => {
    setLoading(true);
    setError(null);
    try {
      const nextForm = { ...form, ...overrides };
      const validationError = validate(nextForm);
      if (validationError) {
        setError(validationError);
        return false;
      }

      const result =
        mode === "edit" && assessmentId
          ? await updateAssessmentAction(assessmentId, nextForm)
          : await createAssessmentAction(nextForm);

      if (!result.success) {
        setError(result.error || "Failed to create assessment. Please try again.");
        return false;
      }

      reset();
      onSuccess?.();
      return true;
    } catch {
      setError("Failed to create assessment. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { form, handleChange, submit, reset, loading, error };
}
