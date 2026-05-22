import { RegisterFormData } from "@/types/auth";
import z from "zod";

export const registerFormSchema = z.object({
    firstName: z
        .string()
        .min(3, { message: "First name must be at least 3 characters long." }),
    lastName: z
        .string()
        .min(3, { message: "Last name must be at least 3 characters long." }),
    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Please enter a valid email." })
        .trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, { message: "Must contain at least one special character." })
        .trim(),
});

export type RegisterActionState = {
    success?: boolean;
    data?: unknown;
    errors?: {
        api?: string[];
    } & Partial<Record<keyof RegisterFormData, string[]>>;
};