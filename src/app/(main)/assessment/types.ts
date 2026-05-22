export type Status = "In Progress" | "Completed" | "Not Started";

export interface Assessment {
  id: number;
  category: string;
  title: string;
  description: string;
  status: Status;
  startDate: string;
  endDate: string;
}
