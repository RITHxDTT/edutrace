"use server";

import {
    CalendarEventPayload,
    createCalendarEvent,
    deleteCalendarEvent,
    getCurrentUsersCalendarEvents,
    updateCalendarEvent
}
    from "@/services/calender.service";

export async function getMyCalendar() {
    return await getCurrentUsersCalendarEvents();
}

export async function createCalendar(
    payload: CalendarEventPayload,
) {
    return await createCalendarEvent(payload);
}

export async function updateCalendar(
    id: string,
    payload: Partial<CalendarEventPayload>,
) {
    return await updateCalendarEvent(id, payload);
}

export async function deleteCalendar(
    id: string,
) {
    return await deleteCalendarEvent(id);
}