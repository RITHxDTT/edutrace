import { z } from "zod";

export const assessmentFormSchema = z.object({
  title: z.string().trim().min(4, "Title must be at least 4 characters."),
  description: z.string(),
  assessmentType: z.enum(["ASSIGNMENT", "PRACTICE", "HOMEWORK", "MINI_PROJECT"], {
    message: "Please select an assessment type.",
  }),
  subjectId: z.string().trim().min(1, "Please select a topic."),
  classroomIds: z.array(z.string()).min(1, "Please select at least one classroom."),
  startAt: z.string().trim().min(1, "Please select an assessment date range."),
  dueAt: z.string().trim().min(1, "Please select an assessment date range."),
  maxScore: z.number().min(1, "Set point must be greater than 0.").max(100, "Set point must not exceed 100."),
  requiredDailyMinutes: z
    .number()
    .min(1, "Daily required minutes must be greater than 0."),
  allowLateSubmissions: z.boolean(),
  gradingRubric: z.string(),
  resourceLink: z.array(z.string()),
  files: z.array(z.instanceof(File)),
  createdTimeZone: z.string(),
});

export type AssessmentFormSchema = z.infer<typeof assessmentFormSchema>;
