export type GetAssessmentParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  status?: "NOT_YET" | "IN_PROGRESS" | "SCHEDULED" | "CLOSED" | "ARCHIVED";
  type?: "ASSIGNMENT" | "PRACTICE" | "HOMEWORK" | "MINI_PROJECT";
  subjectId?: string;
};
interface AssessmentType {
  assessmentId: string;
  title: string;
  description?: string;
  gradingRubric?: string[];
  assessmentType?: string;
  status: "NOT_YET" | "IN_PROGRESS" | "SCHEDULED" | "CLOSED" | "ARCHIVED";
  subject: {
    subjectId?: string;
    subjectName?: string;
    description?: string;
  };
  dueAt?: string;
  startAt?: string;
  assignedBy: {
    userId: string;
    fullName: string;
  }
}

type CreateAssessmentForm = {
  title: string;
  description: string;
  assessmentType: string;
  subjectId: string;
  classroomIds: string[];
  startAt: string;
  dueAt: string;
  maxScore: number;
  requiredDailyMinutes: number;
  allowLateSubmissions: boolean;
  gradingRubric: string;
  resourceLink: string[];
  createdTimeZone: string;
};

interface AssessmentProps {
  assessments: AssessmentType[];
}

export type { AssessmentProps, AssessmentType, CreateAssessmentForm };
