import { CreateAssessmentForm } from "@/types/assessment";
import { useState } from "react";

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
  resourceLink: [],
  createdTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export function useCreateAssessment(onSuccess?: () => void) {
  const [form, setForm] = useState<CreateAssessmentForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof CreateAssessmentForm>(
    key: K,
    value: CreateAssessmentForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setForm(defaultForm);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      reset();
      onSuccess?.();
    } catch (err) {
      setError("Failed to create assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { form, handleChange, submit, reset, loading, error };
}
