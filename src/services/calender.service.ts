import { auth } from "@/auth";
import z from "zod";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const CalendarEventPayload = z.object({
    title: z
        .string()
        .min(1, "Title must be at least 1 character")
        .max(100, "Title must not exceed 100 characters"),
    // description: z
    //     .string()
    //     .max(2500, "Description must not exceed 2500 characters")
    //     .optional(),
    description: z.string(),
    startAt: z.string(),
    endAt: z.string(),
    assessmentId: z.string().nullable(),
    categoryId: z.string(),
});

export type CalendarEventPayloadType = z.infer<
    typeof CalendarEventPayload
>;

async function handleResponseError(response: Response, defaultMessage: string) {
    try {
        const errorText = await response.text();

        if (errorText.includes('{')) {
            const jsonStart = errorText.indexOf('{');
            const jsonString = errorText.substring(jsonStart);
            const errorPayload = JSON.parse(jsonString);

            if (errorPayload.code === "VALIDATION_ERROR" && errorPayload.errors?.[0]) {
                throw new Error(errorPayload.errors[0].message);
            }

            if (errorPayload.message) {
                throw new Error(errorPayload.message);
            }
        }
        throw new Error(`${defaultMessage}: ${response.status} ${errorText}`);
    } catch (e: any) {
        throw new Error(e.message || defaultMessage);
    }
}

export async function getCurrentUsersCalendarEvents() {
    try {
        const session = await auth();

        if (!session?.access_token) {
            throw new Error("Unauthorized");
        }

        const response = await fetch(`${API_URL}/calendar-events/my`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            await handleResponseError(response, "Failed to fetch calendar events");
        }

        return response.json();
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch calendar events");
    }
}

export async function createCalendarEvent(payload: CalendarEventPayloadType) {
    try {
        const session = await auth();

        if (!session?.access_token) {
            throw new Error("Unauthorized");
        }

        const response = await fetch(`${API_URL}/calendar-events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            await handleResponseError(response, "Failed to create calendar event");
        }

        return response.json();
    } catch (error: any) {
        throw new Error(error.message || "Failed to create calendar event");
    }
}

export async function updateCalendarEvent(
    id: string,
    payload: Partial<CalendarEventPayloadType>,
) {
    try {
        const session = await auth();

        if (!session?.access_token) {
            throw new Error("Unauthorized");
        }

        const response = await fetch(`${API_URL}/calendar-events/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            await handleResponseError(response, "Failed to update calendar event");
        }

        return response.json();
    } catch (error: any) {
        throw new Error(error.message || "Failed to update calendar event");
    }
}

export async function deleteCalendarEvent(id: string) {
    try {
        const session = await auth();

        if (!session?.access_token) {
            throw new Error("Unauthorized");
        }

        const response = await fetch(`${API_URL}/calendar-events/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        if (!response.ok) {
            await handleResponseError(response, "Failed to delete calendar event");
        }

        return response.json();
    } catch (error: any) {
        throw new Error(error.message || "Failed to delete calendar event");
    }
}