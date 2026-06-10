export interface Notification {
  notificationId: string;
  title: string;
  content: string;
  type:
      | "ASSESSMENT_ASSIGNED"
      | "ASSESSMENT_DUE"
      | "SUBMISSION_GRADED"
      | "MEETING_STARTED"
      | "MENTION"
      | "SUBMISSION_RECEIVED";
  isRead: boolean;
  createdAt: string;
  link?: string;
}
