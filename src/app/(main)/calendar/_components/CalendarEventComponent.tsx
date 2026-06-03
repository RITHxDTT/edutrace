"use client";

import {
    CalendarColors,
    CalendarType,
    createDayView,
    createEvent,
    createEventsPlugin,
    createMonthView,
    createWeekView,
    DayFlowCalendar,
    useCalendarApp,
    ViewType,
} from "@dayflow/react";
import { createDragPlugin } from "@dayflow/plugin-drag";
import { createSidebarPlugin } from "@dayflow/plugin-sidebar";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createCalendar, deleteCalendar, getMyCalendar, updateCalendar } from "@/actions/calendar.action";

type CalendarHandle = ReturnType<typeof useCalendarApp>;
interface PaletteCalendar extends Pick<CalendarType, "id" | "name" | "icon"> {
    color: string;
    colors: CalendarColors;
    darkColors: CalendarColors;
}

const CALENDAR_SIDE_PANEL: PaletteCalendar[] = [
    { id: "frontend", name: "Frontend", color: "#2563eb", colors: { eventColor: "rgba(37, 99, 235, 0.12)", eventSelectedColor: "#2563eb", lineColor: "#2563eb", textColor: "#1d4ed8" }, darkColors: { eventColor: "rgba(59, 130, 246, 0.25)", eventSelectedColor: "#3b82f6", lineColor: "#60a5fa", textColor: "#dbeafe" } },
    { id: "javascript", name: "JavaScript", color: "#0ea5e9", colors: { eventColor: "rgba(14, 165, 233, 0.12)", eventSelectedColor: "#0ea5e9", lineColor: "#0ea5e9", textColor: "#0369a1" }, darkColors: { eventColor: "rgba(14, 165, 233, 0.24)", eventSelectedColor: "#38bdf8", lineColor: "#7dd3fc", textColor: "#e0f2fe" } },
    { id: "react", name: "React", color: "#8b5cf6", colors: { eventColor: "rgba(139, 92, 246, 0.15)", eventSelectedColor: "#8b5cf6", lineColor: "#8b5cf6", textColor: "#5b21b6" }, darkColors: { eventColor: "rgba(167, 139, 250, 0.28)", eventSelectedColor: "#a855f7", lineColor: "#c084fc", textColor: "#ede9fe" } },
    { id: "typescript", name: "TypeScript", color: "#f97316", colors: { eventColor: "rgba(249, 115, 22, 0.15)", eventSelectedColor: "#f97316", lineColor: "#f97316", textColor: "#7c2d12" }, darkColors: { eventColor: "rgba(251, 146, 60, 0.3)", eventSelectedColor: "#fb923c", lineColor: "#fdba74", textColor: "#ffedd5" } },
    { id: "backend", name: "Backend", color: "#10b981", colors: { eventColor: "rgba(16, 185, 129, 0.15)", eventSelectedColor: "#10b981", lineColor: "#10b981", textColor: "#065f46" }, darkColors: { eventColor: "rgba(52, 211, 153, 0.25)", eventSelectedColor: "#34d399", lineColor: "#6ee7b7", textColor: "#ecfdf5" } },
    { id: "database", name: "Database", color: "#ec4899", colors: { eventColor: "rgba(236, 72, 153, 0.15)", eventSelectedColor: "#ec4899", lineColor: "#ec4899", textColor: "#831843" }, darkColors: { eventColor: "rgba(244, 114, 182, 0.28)", eventSelectedColor: "#f472b6", lineColor: "#f9a8d4", textColor: "#fce7f3" } },
    { id: "project", name: "Capstone Project", color: "#14b8a6", colors: { eventColor: "rgba(20, 184, 166, 0.15)", eventSelectedColor: "#14b8a6", lineColor: "#14b8a6", textColor: "#115e59" }, darkColors: { eventColor: "rgba(45, 212, 191, 0.25)", eventSelectedColor: "#5eead4", lineColor: "#99f6e4", textColor: "#ccfbf1" } },
];

const getWebsiteCalendars = (): CalendarType[] =>
    CALENDAR_SIDE_PANEL.map((item) => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
        colors: { eventColor: `${item.color}30`, eventSelectedColor: `${item.color}`, lineColor: item.color, textColor: item.color },
        isVisible: true,
    }));

const isUuid = (value: unknown): value is string =>
    typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const resolveEventId = (value: unknown): string =>
    typeof value === "string" && value.length > 0
        ? value
        : typeof value === "number"
            ? String(value)
            : "";

type TemporalWithInstant = {
    toInstant?: () => unknown;
    toString?: () => string;
};

const normalizeEventDate = (value: unknown): Date => {
    if (value instanceof Date && !isNaN(value.getTime())) {
        return value;
    }

    const stringValue = typeof value === "string" ? value : value?.toString?.() ?? "";
    const parsedDate = new Date(stringValue);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }

    const temporalValue = value as TemporalWithInstant;
    if (temporalValue.toInstant && typeof temporalValue.toInstant === "function") {
        const instantDate = new Date(String(temporalValue.toInstant()));
        if (!isNaN(instantDate.getTime())) {
            return instantDate;
        }
    }

    return new Date();
};

export default function Home() {
    const [customCalendars, setCustomCalendars] = useState<CalendarType[]>([]);
    const [eventsList, setEventsList] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        async function fetchEvents() {
            try {
                const remoteEvents = await getMyCalendar();
                if (Array.isArray(remoteEvents)) {
                    const parsed = remoteEvents.map((ev: any) => {
                        const startDate = ev.startAt ? new Date(ev.startAt) : new Date();
                        const endDate = ev.endAt ? new Date(ev.endAt) : new Date(Date.now() + 60 * 60 * 1000);
                        const eventId = resolveEventId(ev.id || ev.eventId || ev._id || ev.calendarEventId);

                        return createEvent({
                            id: eventId,
                            title: ev.title || "Untitled Event",
                            description: ev.description || "",
                            start: isNaN(startDate.getTime()) ? new Date() : startDate,
                            end: isNaN(endDate.getTime()) ? new Date(Date.now() + 60 * 60 * 1000) : endDate,
                            calendarId: ev.categoryId || "frontend"
                        });
                    });
                    setEventsList(parsed);
                }
            } catch (err) {
                console.error("Failed loading remote calendar entries:", err);
            }
        }
        fetchEvents();
    }, []);

    const baseCalendars = getWebsiteCalendars();

    const calendarsWithGroups = useMemo(() => {
        const frontend = new Set(["frontend", "javascript", "react", "typescript"]);
        const backend = new Set(["backend", "database", "project"]);
        return [...baseCalendars, ...customCalendars].map((cal) => {
            if (cal.source) return cal;
            return {
                ...cal,
                source: frontend.has(cal.id) ? "Frontend" : backend.has(cal.id) ? "Backend" : undefined,
            };
        });
    }, [baseCalendars, customCalendars]);

    const calendarRef = useRef<CalendarHandle | null>(null);

    const calendar = useCalendarApp({
        views: [createDayView(), createWeekView(), createMonthView()],
        plugins: [
            createDragPlugin(),
            createEventsPlugin(),
            createSidebarPlugin({ createCalendarMode: "modal", showEventDots: true }),
        ],
        calendars: calendarsWithGroups,
        events: eventsList,
        initialDate: new Date(),
        callbacks: {
            onMoreEventsClick: (date: Date) => {
                calendarRef.current?.selectDate(date);
                calendarRef.current?.setCurrentDate(date);
                calendarRef.current?.changeView(ViewType.DAY);
            },
            onCalendarCreate: (newCalendar) => {
                const source = (window as any).__pendingCalendarSource ?? newCalendar.source;
                delete (window as any).__pendingCalendarSource;
                setCustomCalendars((prev) => [...prev, { ...newCalendar, source }]);
            },

            onEventCreate: async (event) => {
                startTransition(async () => {
                    try {
                        console.log("this is the event : " + event)
                        const normalizedStart = normalizeEventDate(event.start);
                        const normalizedEnd = normalizeEventDate(event.end);
                        const tempEventId = event.id;

                        const payload = {
                            title: event.title || "Untitled Event",
                            description: event.description || "",
                            startAt: normalizedStart.toISOString(),
                            endAt: normalizedEnd.toISOString(),
                            assessmentId: (event as any).assessmentId || null,
                            categoryId: isUuid(event.calendarId) ? event.calendarId : null,
                        };

                        const response = await createCalendar(payload);
                        const serverEventId = resolveEventId(response.id) || tempEventId;
                        const resStart = response.startAt ? new Date(response.startAt) : new Date();
                        const resEnd = response.endAt ? new Date(response.endAt) : new Date();
                        const newEvent = createEvent({
                            id: serverEventId,
                            title: response.title || event.title || "Untitled Event",
                            description: response.description || event.description || "",
                            start: isNaN(resStart.getTime()) ? normalizedStart : resStart,
                            end: isNaN(resEnd.getTime()) ? normalizedEnd : resEnd,
                            calendarId: response.categoryId || event.calendarId || "frontend"
                        });

                        setEventsList((prev) => {
                            const alreadyHasTemp = prev.some((e) => e.id === tempEventId);
                            if (alreadyHasTemp) {
                                return prev.map((e) => (e.id === tempEventId ? newEvent : e));
                            }
                            return [...prev, newEvent];
                        });
                    } catch (err) {
                        console.error("Backend error on save processing:", err);
                    }
                });
            },

            onEventUpdate: async (event) => {
                startTransition(async () => {
                    try {
                        const normalizedStart = normalizeEventDate(event.start);
                        const normalizedEnd = normalizeEventDate(event.end);
                        const eventId = resolveEventId(event.id);

                        if (!isUuid(eventId)) {
                            console.warn("Skipping update because eventId is not a valid UUID:", eventId);
                            return;
                        }

                        const payload = {
                            title: event.title,
                            description: event.description || "",
                            startAt: normalizedStart.toISOString(),
                            endAt: normalizedEnd.toISOString(),
                            assessmentId: (event as any).assessmentId || null,
                            categoryId: isUuid(event.calendarId) ? event.calendarId : null,
                        };

                        await updateCalendar(eventId, payload);

                        setEventsList((prev) =>
                            prev.map((e) =>
                                e.id === eventId
                                    ? createEvent({
                                        id: eventId,
                                        title: event.title,
                                        description: event.description || "",
                                        start: normalizedStart,
                                        end: normalizedEnd,
                                        calendarId: event.calendarId,
                                    })
                                    : e,
                            )
                        );
                    } catch (err) {
                        console.error("Backend error on modifications:", err);
                    }
                });
            },

            onEventDelete: async (eventId) => {
                startTransition(async () => {
                    try {
                        const resolvedId = resolveEventId(eventId);
                        if (!isUuid(resolvedId)) {
                            console.warn("Skipping delete because eventId is not a valid UUID:", resolvedId);
                            return;
                        }

                        await deleteCalendar(resolvedId);
                        setEventsList((prev) => prev.filter((e) => e.id !== resolvedId));
                    } catch (err) {
                        console.error("Backend error on deletion handling:", err);
                    }
                });
            },
        },
    });

    useEffect(() => {
        calendarRef.current = calendar;
    }, [calendar]);

    return (
        <div className={`w-full h-full transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
            <DayFlowCalendar calendar={calendar} />
        </div>
    );
}