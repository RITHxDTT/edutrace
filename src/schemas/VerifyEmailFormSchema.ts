import z from "zod";

export const verifyEmailFormSchema = z.object({
    email: z.string().email({ message: "Please enter valid email address." }),
    code: z.string().length(6, "OTP code must be 6 digits.")
});