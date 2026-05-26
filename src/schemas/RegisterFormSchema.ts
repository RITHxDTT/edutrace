import { CalendarDate } from "@internationalized/date";
import z from "zod";

export const createRegisterFormSchema = (classRoomIds: string[]) => {
    return z.object({
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

        gender: z.enum(["MALE", "FEMALE"], {
            message: "Please select a gender.",
        }),

        classroomId: z.string().refine(
            (value) => classRoomIds.includes(value),
            {
                message: "Invalid classroom selected.",
            }
        ),
        birthdate: z
            .instanceof(CalendarDate, {
                message: "Birthdate is required.",
            })
            .refine((val) => {
                const birth = new Date(val.year, val.month - 1, val.day);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                return birth < today;
            }, {
                message: "Birthdate must be in the past.",
            })
    });
};