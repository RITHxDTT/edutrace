export type GetAssessmentParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  status?: "NOT_YET" | "IN_PROGRESS" | "SCHEDULED" | "CLOSED" | "ARCHIVED";
  type?: "ASSIGNMENT" | "PRACTICE" | "HOMEWORK" | "MINI_PROJECT";
  subjectId?: string;
};

type AssessmentClassroom = {
  classroomId: string;
  className?: string;
  classroomAbbre?: string;
};

type AssessmentMetaData = {
  totalElement: number;
  currentPage: number;
  totalPage: number;
  size: number;
};

type AssessmentPagePayload = {
  content: AssessmentType[];
  metaData: AssessmentMetaData;
};

type AssessmentResource = {
  fileName?: string;
  resourceUrl: string;
  mimeType?: string;
  fileSize?: number;
  resourceType?: "LINK" | "FILE" | string;
  updatedAt?: string;
  createdAt?: string;
  assessmentResourceId?: string;
  assessmentId?: string;
};

type SubmissionResource = {
  fileName?: string;
  resourceUrl: string;
  mimeType?: string;
  fileSize?: number;
  resourceType?: "LINK" | "FILE" | string;
  updatedAt?: string;
  createdAt?: string;
  submissionResourceId?: string;
  uploadedAt?: string;
  submissionId?: string;
};

type SubmissionGrade = {
  gradeId?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  graderName?: string;
};

type WorkSession = {
  workSessionId?: string;
  startedAt?: string;
  endedAt?: string;
  userId?: string;
  studentName?: string;
  assessmentId?: string;
  assessmentTitle?: string;
  durationMinutes?: number;
  status?: string;
};

type AssessmentSubmission = {
  submissionId: string;
  status?: "PENDING" | "SUBMITTED" | "GRADED" | "RETURNED" | string;
  submittedAt?: string;
  studentId?: string;
  studentName?: string;
  assessmentTitle?: string;
  isResubmission?: boolean;
  classroomId?: string;
  classroomName?: string;
  classroomAbbre?: string;
  submissionResources?: SubmissionResource[];
  grade?: SubmissionGrade;
  totalTimeSpentMinutes?: number;
  timeSpentTodayMinutes?: number;
  remainingDailyMinutes?: number;
  workSessions?: WorkSession[];
};

type AssessmentSubmissionPayload = {
  content: AssessmentSubmission[];
  metaData?: AssessmentMetaData;
  totalHandedIn?: number;
  totalAssigned?: number;
  handedIn?: number;
  assigned?: number;
};

type WorkSessionPayload = {
  content: WorkSession[];
  metaData?: AssessmentMetaData;
};

type SubmitAssignmentForm = {
  file: File;
  link?: string | null;
  studentNotes?: string | null;
};

interface AssessmentType {
  assessmentId: string;
  title: string;
  description?: string;
  gradingRubric?: string | string[];
  assessmentType?: "ASSIGNMENT" | "PRACTICE" | "HOMEWORK" | "MINI_PROJECT";
  status: "NOT_YET" | "IN_PROGRESS" | "SCHEDULED" | "CLOSED" | "ARCHIVED";
  subject: {
    subjectId?: string;
    subjectName?: string;
    description?: string;
  };
  classroomIds?: string[];
  classrooms?: AssessmentClassroom[];
  dueAt?: string;
  startAt?: string;
  requiredDailyMinutes?: number;
  maxScore?: number;
  assignedBy: {
    userId: string;
    fullName: string;
  }
  resources?: AssessmentResource[];
  studentWorks?: AssessmentSubmission[];
  totalHandedIn?: number;
  totalAssigned?: number;
  totalTimeSpentMinutes?: number;
  timeSpentTodayMinutes?: number;
  remainingDailyMinutes?: number;
  currentSubmissionStatus?: string;
}

type CreateAssessmentForm = {
  title: string;
  description: string;
  assessmentType: "ASSIGNMENT" | "PRACTICE" | "HOMEWORK" | "MINI_PROJECT";
  subjectId: string;
  classroomIds: string[];
  startAt: string;
  dueAt: string;
  maxScore: number;
  requiredDailyMinutes: number;
  allowLateSubmissions: boolean;
  gradingRubric: string;
  files: File[];
  createdTimeZone: string;
};

interface AssessmentProps {
  assessments: AssessmentType[];
  metaData?: AssessmentMetaData;
}

export type {
  AssessmentMetaData,
  AssessmentPagePayload,
  AssessmentProps,
  AssessmentResource,
  AssessmentSubmission,
  AssessmentSubmissionPayload,
  AssessmentType,
  CreateAssessmentForm,
  SubmissionResource,
  SubmitAssignmentForm,
  WorkSession,
  WorkSessionPayload,
};
