import z from "zod";

export const forgotPasswordFormSchema = z.object({
    email: z.string().email({ message: "Please enter valid email address." }),
    code: z.string().length(6, "OTP code must be 6 digits."),
    newPassword: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
            {
                message:
                    "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number, and special character (#@$!%*?&)",
            }
        ),
    confirmNewPassword: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
            {
                message:
                    "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number, and special character (#@$!%*?&)",
            }
        ),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match.",
});