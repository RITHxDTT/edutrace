"use client";

import {
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

import {
    createCalendarAction,
    deleteCalendarAction,
    updateCalendarAction
} from "@/actions/calendar.action";
import { EventType, PaletteCalendar } from "@/types/calendar";

type CalendarHandle = ReturnType<typeof useCalendarApp>;

const CALENDAR_SIDE_PANEL: PaletteCalendar[] = [
    { id: "frontend", name: "Frontend", color: "#2563eb", colors: { eventColor: "rgba(37, 99, 235, 0.12)", eventSelectedColor: "#2563eb", lineColor: "#2563eb", textColor: "#1d4ed8" }, darkColors: { eventColor: "rgba(59, 130, 246, 0.25)", eventSelectedColor: "#3b82f6", lineColor: "#60a5fa", textColor: "#dbeafe" } },
    { id: "javascript", name: "JavaScript", color: "#0ea5e9", colors: { eventColor: "rgba(14, 165, 233, 0.12)", eventSelectedColor: "#0ea5e9", lineColor: "#0ea5e9", textColor: "#0369a1" }, darkColors: { eventColor: "rgba(14, 165, 233, 0.24)", eventSelectedColor: "#38bdf8", lineColor: "#7dd3fc", textColor: "#e0f2fe" } },
    { id: "react", name: "React", color: "#8b5cf6", colors: { eventColor: "rgba(139, 92, 246, 0.15)", eventSelectedColor: "#8b5cf6", lineColor: "#8b5cf6", textColor: "#5b21b6" }, darkColors: { eventColor: "rgba(167, 139, 250, 0.28)", eventSelectedColor: "#a855f7", lineColor: "#c084fc", textColor: "#ede9fe" } },
    { id: "typescript", name: "TypeScript", color: "#f97316", colors: { eventColor: "rgba(249, 115, 22, 0.15)", eventSelectedColor: "#f97316", lineColor: "#f97316", textColor: "#7c2d12" }, darkColors: { eventColor: "rgba(251, 146, 60, 0.3)", eventSelectedColor: "#fb923c", lineColor: "#fb923c", textColor: "#ffedd5" } },
    { id: "backend", name: "Backend", color: "#10b981", colors: { eventColor: "rgba(16, 185, 129, 0.15)", eventSelectedColor: "#10b981", lineColor: "#10b981", textColor: "#065f46" }, darkColors: { eventColor: "rgba(52, 211, 153, 0.25)", eventSelectedColor: "#34d399", lineColor: "#6ee7b7", textColor: "#ecfdf5" } },
    { id: "database", name: "Database", color: "#ec4899", colors: { eventColor: "rgba(236, 72, 153, 0.15)", eventSelectedColor: "#ec4899", lineColor: "#ec4899", textColor: "#831843" }, darkColors: { eventColor: "rgba(244, 114, 182, 0.28)", eventSelectedColor: "#f472b6", lineColor: "#f9a8d4", textColor: "#fce7f3" } },
    { id: "project", name: "Capstone Project", color: "#14b8a6", colors: { eventColor: "rgba(20, 184, 166, 0.15)", eventSelectedColor: "#14b8a6", lineColor: "#14b8a6", textColor: "#115e59" }, darkColors: { eventColor: "rgba(45, 212, 191, 0.25)", eventSelectedColor: "#5eead4", lineColor: "#99f6e4", textColor: "#ccfbf1" } },
];

type Props = {
    allevents: EventType[];
};

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

const normalizeEventDate = (value: unknown): Date => {
    if (value instanceof Date && !isNaN(value.getTime())) {
        return value;
    }
    const stringValue = typeof value === "string" ? value : (value as any)?.toString?.() ?? "";
    const parsedDate = new Date(stringValue);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }
    return new Date();
};

export default function CalendarEventComponent({ allevents }: Props) {
    const [customCalendars, setCustomCalendars] = useState<CalendarType[]>([]);
    const [isPending, startTransition] = useTransition();

    const deletingIds = useRef<Set<string>>(new Set());
    const calendarRef = useRef<CalendarHandle | null>(null);

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

    const parseServerEvents = (dataArray: EventType[]) => {
        if (!Array.isArray(dataArray)) return [];
        return dataArray.map((ev: EventType) => {
            const startDate = ev.startAt ? new Date(ev.startAt) : new Date();
            const endDate = ev.endAt ? new Date(ev.endAt) : new Date(Date.now() + 60 * 60 * 1000);

            const eventId = resolveEventId(ev.calendarEventId || (ev as any).id || (ev as any)._id);

            return createEvent({
                id: eventId,
                title: ev.title || "Untitled Event",
                description: ev.description || "",
                start: isNaN(startDate.getTime()) ? new Date() : startDate,
                end: isNaN(endDate.getTime()) ? new Date(Date.now() + 60 * 60 * 1000) : endDate,
                calendarId: ev.category?.categoryId || "frontend"
            });
        });
    };

    const initialEvents = useMemo(() => {
        return parseServerEvents(allevents);
    }, [allevents]);

    useEffect(() => {
        const addPlusButtons = () => {
            const labels = document.querySelectorAll(".df-sidebar-source-label");

            labels.forEach((label) => {
                if (label.querySelector(".group-plus-btn")) return;

                const labelEl = label as HTMLElement;

                labelEl.style.display = "inline-flex";
                labelEl.style.alignItems = "center";
                labelEl.style.gap = "6px";

                const plusBtn = document.createElement("span");

                plusBtn.textContent = "+";
                plusBtn.className = "group-plus-btn";
                plusBtn.setAttribute("role", "button");
                plusBtn.setAttribute("tabindex", "0");

                plusBtn.style.width = "18px";
                plusBtn.style.height = "18px";
                plusBtn.style.borderRadius = "4px";
                plusBtn.style.display = "inline-flex";
                plusBtn.style.alignItems = "center";
                plusBtn.style.justifyContent = "center";
                plusBtn.style.fontSize = "14px";
                plusBtn.style.cursor = "pointer";

                plusBtn.onpointerdown = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                };

                plusBtn.onmousedown = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                };

                plusBtn.onclick = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();

                    const sourceToggle = labelEl.closest(
                        ".df-sidebar-source-toggle",
                    ) as HTMLElement | null;

                    if (!sourceToggle) return;

                    sourceToggle.dispatchEvent(
                        new MouseEvent("contextmenu", {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            button: 2,
                            buttons: 2,
                            clientX: -9999,
                            clientY: -9999,
                        }),
                    );

                    setTimeout(() => {
                        const newCalendarItem = Array.from(
                            document.querySelectorAll(".df-context-menu-item"),
                        ).find((item) => item.textContent?.trim() === "New Calendar") as
                            | HTMLElement
                            | undefined;

                        if (!newCalendarItem) return;

                        newCalendarItem.click();

                        setTimeout(() => {
                            const input = document.getElementById(
                                "blossom-calendar-name",
                            ) as HTMLInputElement | null;

                            if (!input) return;

                            const groupName = labelEl.textContent?.replace("+", "").trim() ?? "";

                            if (groupName) {
                                input.placeholder = `e.g. ${groupName}/event`;
                            }

                            const interceptSubmit = () => {
                                const rawName = input.value.trim();
                                const parts = rawName.split("/").map((v) => v.trim()).filter(Boolean);

                                let source: string;
                                let calendarName: string;

                                if (parts.length >= 2) {
                                    source = parts[0];
                                    calendarName = parts.slice(1).join("/");
                                } else {
                                    source = groupName;
                                    calendarName = rawName;
                                }

                                const nativeSet = Object.getOwnPropertyDescriptor(
                                    window.HTMLInputElement.prototype, "value"
                                )?.set;

                                if (nativeSet) {
                                    nativeSet.call(input, calendarName);
                                    input.dispatchEvent(new Event("input", { bubbles: true }));
                                    input.dispatchEvent(new Event("change", { bubbles: true }));
                                }

                                (window as any).__pendingCalendarSource = source;

                                cleanup();
                            };

                            const handleKeydown = (e: KeyboardEvent) => {
                                if (e.key === "Enter") interceptSubmit();
                            };

                            const submitBtn = input
                                .closest("form, .df-create-calendar-dialog, [role='dialog']")
                                ?.querySelector("button[type='submit'], button:not([type='button'])") as
                                | HTMLElement | undefined;

                            const cleanup = () => {
                                input.removeEventListener("keydown", handleKeydown);
                                submitBtn?.removeEventListener("click", interceptSubmit, { capture: true });
                            };

                            input.addEventListener("keydown", handleKeydown);
                            submitBtn?.addEventListener("click", interceptSubmit, { capture: true });
                        }, 50);
                        requestAnimationFrame(() => {
                            document
                                .querySelectorAll(
                                    ".df-context-menu, .df-portal:not(.df-create-calendar-dialog-backdrop)",
                                )
                                .forEach((el) => el.remove());
                        });
                    }, 50);
                };
                labelEl.appendChild(plusBtn);
            });
        };
        addPlusButtons();

        const observer = new MutationObserver(addPlusButtons);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, []);

    const calendar = useCalendarApp({
        views: [createDayView(), createWeekView(), createMonthView()],
        plugins: [
            createDragPlugin(),
            createEventsPlugin(),
            createSidebarPlugin({ createCalendarMode: "modal", showEventDots: true }),
        ],
        calendars: calendarsWithGroups,
        events: initialEvents,
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

            onEventUpdate: async (event) => {
                const eventId = resolveEventId(event.id);

                if (!isUuid(eventId)) {
                    return;
                }

                startTransition(async () => {
                    try {
                        const normalizedStart = normalizeEventDate(event.start);
                        const normalizedEnd = normalizeEventDate(event.end);

                        const payload = {
                            title: event.title,
                            description: event.description || "",
                            startAt: normalizedStart.toISOString(),
                            endAt: normalizedEnd.toISOString(),
                            assessmentId: (event as any).assessmentId || null,
                            categoryId: isUuid(event.calendarId) ? event.calendarId : null,
                        };

                        await updateCalendarAction(eventId, payload);

                    } catch (err) {
                        console.error("Backend error during event update:", err);
                    }
                });
                console.log("update successfully:", eventId)
            },

            onEventDelete: async (eventId) => {
                const resolvedId = resolveEventId(eventId);
                if (deletingIds.current.has(resolvedId)) {
                    return;
                }

                if (!isUuid(resolvedId)) {
                    return;
                }

                startTransition(async () => {
                    try {
                        deletingIds.current.add(resolvedId);
                        await deleteCalendarAction(resolvedId);
                    } catch (err) {
                        console.error("Error deleting event from backend database:", err);
                    } finally {
                        deletingIds.current.delete(resolvedId);
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