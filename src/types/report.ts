export interface Report {
  reportId: string;
  reportName: string;
  reportType: "ASSESSMENT" | "CLASS";
  displayType: string;
  period: string;
  generatedAt: string;
  classScope?: string;
}

export interface ReportSummary {
  totalReports: number;
  taskBasedReports: number;
  classBasedReports: number;
  lastGenerated?: string;
}

export interface ReportResponse {
  summary: ReportSummary;
  reports: Report[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  payload: T;
  status: number;
  path: string;
  timestamp: string;
}

export interface CreateTaskReportDto {
  title: string;
  assessmentId: string;
  classroomIds: string[];
  startDate: string;
  endDate: string;
}

export interface CreateClassReportDto {
  title: string;
  subjectId: string;
  classroomIds: string[];
  startDate: string;
  endDate: string;
}

export interface summaryReportDto {
  totalReports: number;
  taskBasedReports: number;
  classBasedReports: number;
  lastGenerated?: string;
}

export interface taskBaseReport {
  title: string;
  assessmentId: string;
  startDate: string;
  endDate: string;
}

export interface ScoreDistributionItem {
  count: number;
  range: string;
}

export interface ScoreDistribution {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  scoreBasis?: string;
  data: ScoreDistributionItem[];
}

export interface StudentProps {
  
  fullName: string;
  gender: string;
  email: string;
  dob: string | null;
  profileImage?: string | null;
  className:string,
  classroomAbbre:string,
  submissionStatus:string,
  averageScore: number,
}

export interface ReportDetailResponse {
  reportId: string;
  reportName: string;
  reportType: string;
  generatedAt: string;

  reportData: {
    viewingLabel: string;
    scoreDistribution: ScoreDistribution;

    summary: {
      late: number;
      onTime: number;
      missing: number;
      averageScore: number;
      totalStudents: number;
      totalSubmitted: number;
      totalSubmissionRate: number;
    };

    classroom?: {
      classroomId: string;
      className: string;
      classroomAbbre: string;
    };

    students?: {
      title: string;
      total: number;

      data: StudentProps[];  

    };

    submission?: {
      late: number;
      onTime: number;
      missing: number;
    };
  };
}

export interface Student {
  studentId: string;

  fullName: string;

  email: string;

  gender: string | null;

  dob: string | null;

  averageScore: number;

  profileImage?: string | null;

  classroomAbbre: string;

  submissionStatus: string;
}
