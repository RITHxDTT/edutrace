export interface DashboardValue {
  value: number;
}

export interface DashboardValueWithTotalClasses extends DashboardValue {
  totalClasses: number;
}

export interface DashboardRate extends DashboardValue {
  change: number;
  changeDirection: "NO_CHANGE" | "UP" | "DOWN";
  comparisonLabel: string;
}

export interface DashboardSummary {
  totalTasks: DashboardValueWithTotalClasses;
  activeTasks: DashboardValue;
  submissionRate: DashboardRate;
  lateSubmissionRate: DashboardRate;
  atRiskStudents: DashboardValue;
}

export interface SubmissionTrendLegend {
  key: string;
  label: string;
}

export interface SubmissionTrendData {
  day: string;
  onTime: number;
  lateSubmission: number;
}

export interface SubmissionTrend {
  title: string;
  xLabel: string;
  yLabel: string;
  legend: SubmissionTrendLegend[];
  data: SubmissionTrendData[];
}

export interface DashboardRecentTask {
  assessmentId: string;
  taskName: string;
  classroomId: string;
  className: string;
  classroomAbbre: string;
  deadline: string;
  submissionRate: number;
  status: string;
}

export interface DashboardCurrentTask extends DashboardRecentTask {
  startAt: string;
  dueAt: string;
}

export interface Reminder {
  title: string;
  description: string;
  actionLabel: string;
  assessmentId: string;
  meetingRoomId: string;
}

export interface DashboardTeacherPayload {
  summary: DashboardSummary;
  submissionTrend: SubmissionTrend;
  recentTasks: DashboardRecentTask[];
  studentProgress: any[];
  currentTasks: DashboardCurrentTask[];
  reminder: Reminder;
}

export interface StudentInfo {
  studentId: string;
  studentName: string;
  email: string;
  classroomId: string;
  className: string;
  classroomAbbre: string;
}

export interface StudentTaskAssigned {
  value: number;
  activeNow: number;
}

export interface StudentTaskCompleted {
  value: number;
  completionRate: number;
}

export interface StudentHoursLogged {
  value: number;
  thisMonthHours: number;
}

export interface StudentOnTimeRate {
  value: number;
  submittedCount: number;
  totalSubmissionCount: number;
}

export interface DashboardStudentSummary {
  taskAssigned: StudentTaskAssigned;
  taskCompleted: StudentTaskCompleted;
  totalHoursLogged: StudentHoursLogged;
  onTimeRate: StudentOnTimeRate;
}

export interface ScoreTrendData {
  taskName: string;
  yourScore: number;
  classAverageScore: number;
}

export interface ScoreTrend {
  title: string;
  description: string;
  xLabel: string;
  yLabel: string;
  legend: SubmissionTrendLegend[];
  data: ScoreTrendData[];
}

export interface SubmissionDonutData {
  status: "MISSED" | "ON_TIME" | "LATE";
  label: string;
  count: number;
  percentage: number;
}

export interface SubmissionTrendsDonut {
  title: string;
  centerLabel: string;
  data: SubmissionDonutData[];
}

export interface ProgressData {
  week: string;
  loggedHours: number;
  requiredHours: number;
}

export interface WeeklyVsRequiredProgress {
  title: string;
  xLabel: string;
  yLabel: string;
  legend: SubmissionTrendLegend[];
  data: ProgressData[];
}

export interface DashboardStudentPayload {
  student: StudentInfo;
  summary: DashboardStudentSummary;
  scoreTrendOverTasks: ScoreTrend;
  submissionTrendsDonut: SubmissionTrendsDonut;
  weeklyVsRequiredProgress: WeeklyVsRequiredProgress;
  activityLogs: any[];
}
