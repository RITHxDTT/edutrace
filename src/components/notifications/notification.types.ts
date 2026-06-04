export interface Notification {
    notificationId : string,
    title: string,
    content: string,
    type:
    | "ASSIGNMENT"
    | "SUBMISSION"
    | "GRADE"
    | "ANNOUNCEMENT"
    | "FEEDBACK"
    | "FILE_UPLOAD";
    isRead: boolean;
    createdAt: string;
}