import z from "zod";

export const forgotPasswordFormSchema = z.object({
    email: z.string().email({ message: "Please enter valid email address." }),
    code: z.string().length(6, "OTP code must be 6 digits."),
    newPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, { message: "Must contain at least one special character." })
        .trim(),
    confirmNewPassword: z.string().min(8, "Password must be at least 8 characters."),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match.",
});