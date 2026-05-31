export type GetAssessmentParams = {
    page?: number;
    size?: number;
    sortBy?: string;
    status?: "NOT_YET" | "IN_PROGRESS" | "SCHEDULED" | "CLOSED" | "ARCHIVED";
    type?: "ASSIGNMENT" | "PRACTICE" | "HOMEWORK" | "MINI_PROJECT";
    subjectId?: string;
}
interface AssessmentType {
    assessmentId: string;
    title: string;
    description?: string;
    subjectId?: string;
    gradingRubric?: string[];
    assessmentType?: string;
}

interface AssessmentProps {
    assessments: AssessmentType[]
}

export type { AssessmentProps, AssessmentType }