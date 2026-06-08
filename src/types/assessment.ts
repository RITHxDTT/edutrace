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
  assessmentId?: string;
  assessmentResourceId?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  resourceType?: "LINK" | "FILE" | string;
  resourceUrl: string;
  updatedAt?: string;
  createdAt?: string;
};

type SubmissionResource = {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  resourceType?: "LINK" | "FILE" | string;
  resourceUrl: string;
  updatedAt?: string;
  uploadedAt?: string;
  submissionResourceId?: string;
  submissionId?: string;
};

type SubmissionGrader = {
  userId?: string;
  fullName?: string;
  profileImageUrl?: string;
};

type SubmissionGrade = {
  gradeId?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  graderName?: string;
  grader?: SubmissionGrader;
};

type SubmissionStudent = {
  userId?: string;
  fullName?: string;
  profileImageUrl?: string;
  classroom: AssessmentClassroom;
};

type LearningProgress = {
  totalTimeSpentMinutes: number;
  timeSpentTodayMinutes: number;
  remainingDailyMinutes: number;
};

type LatestSubmission = {
  submissionId: string;
  status: "SUBMITTED" | "RESUBMITTED" | "GRADED" | string;
  submittedAt: string;
  assessmentTitle?: string;
  isResubmission: boolean;
  submissionResources?: SubmissionResource[];
};

type SubmittedStudent = {
  userId: string;
  fullName: string;
  profileImageUrl?: string | null;
  learningProgress: LearningProgress;
  latestSubmission: LatestSubmission | null;
  history: LatestSubmission[];
};

type UnsubmittedStudent = {
  userId: string;
  fullName: string;
  profileImageUrl?: string | null;
  learningProgress: LearningProgress;
  latestSubmission: null;
  history: [];
};

type StudentWork = {
  classroomId: string;
  classroomName: string;
  submittedCount: number;
  unsubmittedCount: number;
  submittedStudents: SubmittedStudent[];
  unsubmittedStudents: UnsubmittedStudent[];
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

type WorkSessionPayload = {
  content: WorkSession[];
  metaData?: AssessmentMetaData;
};

type SubmissionDetail = LatestSubmission & {
  student?: SubmissionStudent;
  grade?: SubmissionGrade;
  workSessions?: WorkSession[];
  totalTimeSpentMinutes?: number;
  timeSpentTodayMinutes?: number;
  remainingDailyMinutes?: number;
};

type StudentOwnSubmission = LatestSubmission & {
  grade?: SubmissionGrade;
};

type SubmitAssignmentForm = {
  file: File;
  link?: string | null;
  studentNotes?: string | null;
};

type GradeSubmissionForm = {
  submissionId: string;
  score: number;
  feedback: string;
};

interface AssessmentType {
  assessmentId: string;
  title: string;
  status: "NOT_YET" | "IN_PROGRESS" | "SCHEDULED" | "CLOSED" | "ARCHIVED";
  description?: string;
  gradingRubric?: string;
  assessmentType?: "ASSIGNMENT" | "PRACTICE" | "HOMEWORK" | "MINI_PROJECT";
  dueAt?: string;
  startAt?: string;
  requiredDailyMinutes?: number;
  maxScore?: number;
  isResubmission?: boolean;
  assignedBy: {
    userId: string;
    fullName: string;
  };
  subject: {
    subjectId?: string;
    subjectName?: string;
    description?: string;
  };
  classroomIds?: string[];
  classrooms?: AssessmentClassroom[];
  studentWorks?: StudentWork[];
  resources?: AssessmentResource[];
  meetingId?: string;
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
  resourceLink: string[];
  files: File[];
  createdTimeZone: string;
};

interface AssessmentProps {
  assessments: AssessmentType[];
  metaData?: AssessmentMetaData;
}

export type {
  AssessmentClassroom,
  AssessmentMetaData,
  AssessmentPagePayload,
  AssessmentProps,
  AssessmentResource,
  AssessmentType,
  CreateAssessmentForm,
  GradeSubmissionForm,
  LearningProgress,
  LatestSubmission,
  StudentOwnSubmission,
  StudentWork,
  SubmissionDetail,
  SubmissionGrade,
  SubmissionResource,
  SubmissionStudent,
  SubmitAssignmentForm,
  SubmittedStudent,
  UnsubmittedStudent,
  WorkSession,
  WorkSessionPayload,
};
