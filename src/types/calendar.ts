import { CalendarColors, CalendarType } from "@dayflow/react";

export interface PaletteCalendar extends Pick<CalendarType, "id" | "name" | "icon"> {
    color: string;
    colors: CalendarColors;
    darkColors: CalendarColors;
}

type EventType = {
    calendarEventId: string;
    title: string,
    description: string,
    startAt: Date,
    endAt: Date,
    createdBy: Date,
    assessmentId: string,
    category: {
        categoryId: string,
        name: string,
        colorCode: string,
        parentCategory: {
            categoryId: string,
            name: string
        },
        theme: string,
        userId: string,
        createdAt: Date,
        updatedAt: Date
    }
}

export type { EventType }
