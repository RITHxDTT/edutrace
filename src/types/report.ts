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
