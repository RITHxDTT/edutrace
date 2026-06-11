"use server";

import {
    createCalendarEventService,
    deleteCalendarEventService,
    getCalendarEventsByIdService,
    getCurrentUsersCalendarEventsService,
    updateCalendarEventService
} from "@/services/calender.service";
import type { CalendarEventPayloadType } from "@/services/calender.service";

export async function getMyCalendarAction() {
    const result = await getCurrentUsersCalendarEventsService();

    return result.payload.content;
}

export async function getCalendarEventsByIdAction(id: string) {
    const result = await getCalendarEventsByIdService(id);

    return result.payload.content;

}

export async function createCalendarAction(payload: CalendarEventPayloadType) {
    const result = await createCalendarEventService(payload);
    return result.payload;
}

export async function updateCalendarAction(id: string, payload: Partial<CalendarEventPayloadType>) {
    const resultAfterUpdate = await updateCalendarEventService(id, payload);
    return resultAfterUpdate.payload;
}

export async function deleteCalendarAction(id: string) {
    const resultAfterDelete = await deleteCalendarEventService(id);
    return resultAfterDelete.payload;
}