import { z } from "zod";

export const generateReportSchema = z
  .object({
    reportName: z.string().min(1, "Report Name is required"),
    startDate: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required"),
  })
  .superRefine((data, ctx) => {
    if (!data.startDate || !data.endDate) return;

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (end < start) {
      ctx.addIssue({
        path: ["endDate"],
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
      });
    }
  }
);

