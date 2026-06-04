import { createAssessmentAction, updateAssessmentAction } from "@/actions/assessment.action";
import { AssessmentType, CreateAssessmentForm } from "@/types/assessment";
import { ClassroomType } from "@/types/classroom";
import { useMemo, useState } from "react";
import { z } from "zod";

type CreateAssessmentFormErrors = Partial<
  Record<keyof CreateAssessmentForm, string>
>;

const STEP_FIELDS: Record<number, (keyof CreateAssessmentForm)[]> = {
  0: ["title", "assessmentType"],
  1: ["subjectId", "classroomIds", "startAt", "dueAt", "maxScore", "requiredDailyMinutes"],
};

const assessmentFormSchema = z.object({
  title: z.string().trim().min(4, "Title must be at least 4 characters."),
  description: z.string(),
  assessmentType: z.enum(["ASSIGNMENT", "PRACTICE", "HOMEWORK", "MINI_PROJECT"], {
    message: "Please select an assessment type.",
  }),
  subjectId: z.string().trim().min(1, "Please select a topic."),
  classroomIds: z.array(z.string()).min(1, "Please select at least one classroom."),
  startAt: z.string().trim().min(1, "Please select an assessment date range."),
  dueAt: z.string().trim().min(1, "Please select an assessment date range."),
  maxScore: z.number().min(1, "Set point must be greater than 0."),
  requiredDailyMinutes: z
    .number()
    .min(1, "Daily required minutes must be greater than 0."),
  allowLateSubmissions: z.boolean(),
  gradingRubric: z.string(),
  files: z.array(z.instanceof(File)),
  createdTimeZone: z.string(),
});

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

function getStringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getRecordValue(value: unknown, key: string) {
  if (!value || typeof value !== "object") return undefined;

  return (value as Record<string, unknown>)[key];
}

function resolveClassroomId(value: unknown, taughtClassrooms: ClassroomType[]) {
  const nestedClassroom = getRecordValue(value, "classroom");
  const candidates = [
    getStringValue(value),
    getStringValue(getRecordValue(value, "classroomId")),
    getStringValue(getRecordValue(value, "id")),
    getStringValue(getRecordValue(value, "classId")),
    getStringValue(getRecordValue(nestedClassroom, "classroomId")),
    getStringValue(getRecordValue(nestedClassroom, "id")),
    getStringValue(getRecordValue(value, "classroomAbbre")),
    getStringValue(getRecordValue(value, "className")),
    getStringValue(getRecordValue(value, "classroomName")),
  ].filter(Boolean);

  const matchedClassroom = taughtClassrooms.find((classroom) =>
    candidates.some(
      (candidate) =>
        candidate === classroom.classroomId ||
        candidate === classroom.classroomAbbre ||
        candidate === classroom.className,
    ),
  );

  return matchedClassroom?.classroomId ?? candidates[0];
}

function getAssessmentClassroomIds(
  assessment: AssessmentType,
  taughtClassrooms: ClassroomType[],
) {
  const values = assessment.classroomIds?.length
    ? assessment.classroomIds
    : assessment.classrooms ?? [];

  return Array.from(
    new Set(
      values
        .map((classroom) => resolveClassroomId(classroom, taughtClassrooms))
        .filter((classroomId): classroomId is string => !!classroomId),
    ),
  );
}

function toAssessmentForm(
  assessment?: AssessmentType,
  taughtClassrooms: ClassroomType[] = [],
): CreateAssessmentForm {
  if (!assessment) {
    return {
      ...defaultForm,
      classroomIds: [],
      files: [],
      createdTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  return {
    title: assessment.title ?? "",
    description: assessment.description ?? "",
    assessmentType: assessment.assessmentType ?? "ASSIGNMENT",
    subjectId: assessment.subject.subjectId ?? "",
    classroomIds: getAssessmentClassroomIds(assessment, taughtClassrooms),
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
  taughtClassrooms?: ClassroomType[];
  mode?: "create" | "edit";
  onSuccess?: () => void;
};

export function useCreateAssessment({
  assessment,
  assessmentId,
  taughtClassrooms = [],
  mode = "create",
  onSuccess,
}: UseCreateAssessmentOptions = {}) {
  const initialForm = useMemo(
    () => toAssessmentForm(assessment, taughtClassrooms),
    [assessment, taughtClassrooms],
  );
  const [form, setForm] = useState<CreateAssessmentForm>(initialForm);
  const [errors, setErrors] = useState<CreateAssessmentFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof CreateAssessmentForm>(
    key: K,
    value: CreateAssessmentForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;

      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep = (step: number) => {
    const fields = STEP_FIELDS[step] ?? [];
    const result = assessmentFormSchema.safeParse(form);
    const stepErrors: CreateAssessmentFormErrors = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateAssessmentForm | undefined;
        if (field && fields.includes(field) && !stepErrors[field]) {
          stepErrors[field] = issue.message;
        }
      });
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return stepErrors;
    }
    return null;
  };

  const reset = () => {
    setForm(mode === "edit" ? initialForm : toAssessmentForm());
    setErrors({});
    setError(null);
  };

  const validate = (nextForm: CreateAssessmentForm) => {
    const result = assessmentFormSchema.safeParse(nextForm);
    if (result.success) return null;

    const nextErrors: CreateAssessmentFormErrors = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof CreateAssessmentForm | undefined;
      if (field && !nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    });

    return nextErrors;
  };

  const submit = async (overrides?: Partial<CreateAssessmentForm>) => {
    setLoading(true);
    setError(null);
    try {
      const nextForm = { ...form, ...overrides };
      const validationErrors = validate(nextForm);
      if (validationErrors) {
        setErrors(validationErrors);
        return false;
      }
      setErrors({});

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

  return { form, errors, handleChange, submit, reset, loading, error, validateStep };
}

export type { CreateAssessmentFormErrors };
