type ClassroomType = {
    classroomId: string;
    className: string;
    classroomAbbre: string;
}

export interface ClassroomProps {
    classrooms: ClassroomType[]
}

export interface ReportClientPageProps {
  initialReports: Report[];
  summary: {
    totalReports: number;
    taskBasedReports: number;
    classBasedReports: number;
    lastGenerated: string;
  };
  totalPages: number;
  currentPage: number;
  activeTab: string;
  classrooms: any[];
}