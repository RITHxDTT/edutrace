import { auth } from "@/auth";
import z from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const CalendarEventPayload = z.object({
    title: z
        .string()
        .min(1, "Title must be at least 1 character")
        .max(100, "Title must not exceed 100 characters"),
    description: z.string().optional().default(""),
    startAt: z.string(),
    endAt: z.string(),
    assessmentId: z.string().nullable().default(null),
    categoryId: z.string().nullable().default(null),
});

export type CalendarEventPayloadType = z.infer<typeof CalendarEventPayload>;

async function getAuthHeaders() {
    const session = await auth();
    if (!session?.access_token) {
        throw new Error("Unauthorized");
    }
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
    };
}

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
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/calendar-events/my`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        if (!response.ok) {
            await handleResponseError(response, "Failed to fetch calendar events");
        }

        const result = await response.json();
        console.log("1. getCurrentUsersCalendarEvents result:", result);
        return result;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch calendar events");
    }
}

export async function getCalendarEventsById(id: string) {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/calendar-events/${id}`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        if (!response.ok) {
            await handleResponseError(response, `Failed to fetch calendar event with ID: ${id}`);
        }

        const result = await response.json();
        console.log(`2. getCalendarEventsById (ID: ${id}) result:`, result);
        return result;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch calendar event");
    }
}

export async function createCalendarEvent(payload: CalendarEventPayloadType) {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/calendar-events`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            await handleResponseError(response, "Failed to create calendar event");
        }

        const result = await response.json();
        console.log("3. createCalendarEvent result:", result);
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(String(error) || "Failed to create calendar event");
    }
}

export async function updateCalendarEvent(
    id: string,
    payload: Partial<CalendarEventPayloadType>,
) {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/calendar-events/${id}`, {
            method: "PUT", // Matched with your swagger schema image
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            await handleResponseError(response, `Failed to update calendar event with ID: ${id}`);
        }

        const result = await response.json();
        console.log(`4. updateCalendarEvent (ID: ${id}) result:`, result);
        return result;
    } catch (error: any) {
        throw new Error(error.message || "Failed to update calendar event");
    }
}

export async function deleteCalendarEvent(id: string) {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/calendar-events/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: headers.Authorization
            },
        });

        if (!response.ok) {
            await handleResponseError(response, `Failed to delete calendar event with ID: ${id}`);
        }

        const result = await response.json().catch(() => ({ success: true }));
        console.log(`5. deleteCalendarEvent (ID: ${id}) result:`, result);
        return result;
    } catch (error: any) {
        throw new Error(error.message || "Failed to delete calendar event");
    }
}