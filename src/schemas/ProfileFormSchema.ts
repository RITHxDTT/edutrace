import { CalendarDate } from "@internationalized/date";
import z from "zod";

export const profileFormScehma =
    z.object({
        firstName: z
            .string()
            .min(3, { message: "First name must be at least 3 characters long." }),

        lastName: z
            .string()
            .min(3, { message: "Last name must be at least 3 characters long." }),

        username: z
            .string()
            .min(3, { message: "User must be at least 3 characters long." }),

        gender: z.enum(["MALE", "FEMALE"], {
            message: "Please select a gender.",
        })
            .optional()
            .or(z.literal("")),

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
            }),

        address: z
            .string()
            .trim()
            .min(5, {
                message: "Address must be at least 5 characters long.",
            })
            .optional()
            .or(z.literal("")),
    });