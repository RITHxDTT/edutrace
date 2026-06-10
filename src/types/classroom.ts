// export type ClassroomType = {
//     classroomId: string;
//     className: string;
//     classroomAbbre: string;
//     lateSubmission: number;
// }

// export interface ClassroomProps {
//     classrooms: ClassroomType[]
// }

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


type ClassroomType = {
    classroomId: string;
    className: string;
    classroomAbbre: string;
}

export interface ClassroomProps {
    classrooms: ClassroomType[]
}

interface Classroom {
  classroomId: string;
  className: string;
  classroomAbbre: string;
}

interface Subject {
  subjectId: string;
  subjectName: string;
}

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateSuccess?: () => void;
}

export type { ClassroomType, Classroom, Subject, GenerateReportModalProps }