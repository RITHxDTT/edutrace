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
import { useEffect, useMemo, useRef, useState } from "react";

type CalendarHandle = ReturnType<typeof useCalendarApp>;
interface PaletteCalendar extends Pick<CalendarType, "id" | "name" | "icon"> {
    color: string;
    colors: CalendarColors;
    darkColors: CalendarColors;
}

const CALENDAR_SIDE_PANEL: PaletteCalendar[] = [
    {
        id: "frontend",
        name: "Frontend",
        color: "#2563eb",
        colors: {
            eventColor: "rgba(37, 99, 235, 0.12)",
            eventSelectedColor: "#2563eb",
            lineColor: "#2563eb",
            textColor: "#1d4ed8",
        },
        darkColors: {
            eventColor: "rgba(59, 130, 246, 0.25)",
            eventSelectedColor: "#3b82f6",
            lineColor: "#60a5fa",
            textColor: "#dbeafe",
        },
    },
    {
        id: "javascript",
        name: "JavaScript",
        color: "#0ea5e9",
        colors: {
            eventColor: "rgba(14, 165, 233, 0.12)",
            eventSelectedColor: "#0ea5e9",
            lineColor: "#0ea5e9",
            textColor: "#0369a1",
        },
        darkColors: {
            eventColor: "rgba(14, 165, 233, 0.24)",
            eventSelectedColor: "#38bdf8",
            lineColor: "#7dd3fc",
            textColor: "#e0f2fe",
        },
    },
    {
        id: "react",
        name: "React",
        color: "#8b5cf6",
        colors: {
            eventColor: "rgba(139, 92, 246, 0.15)",
            eventSelectedColor: "#8b5cf6",
            lineColor: "#8b5cf6",
            textColor: "#5b21b6",
        },
        darkColors: {
            eventColor: "rgba(167, 139, 250, 0.28)",
            eventSelectedColor: "#a855f7",
            lineColor: "#c084fc",
            textColor: "#ede9fe",
        },
    },
    {
        id: "typescript",
        name: "TypeScript",
        color: "#f97316",
        colors: {
            eventColor: "rgba(249, 115, 22, 0.15)",
            eventSelectedColor: "#f97316",
            lineColor: "#f97316",
            textColor: "#7c2d12",
        },
        darkColors: {
            eventColor: "rgba(251, 146, 60, 0.3)",
            eventSelectedColor: "#fb923c",
            lineColor: "#fdba74",
            textColor: "#ffedd5",
        },
    },
    {
        id: "backend",
        name: "Backend",
        color: "#10b981",
        colors: {
            eventColor: "rgba(16, 185, 129, 0.15)",
            eventSelectedColor: "#10b981",
            lineColor: "#10b981",
            textColor: "#065f46",
        },
        darkColors: {
            eventColor: "rgba(52, 211, 153, 0.25)",
            eventSelectedColor: "#34d399",
            lineColor: "#6ee7b7",
            textColor: "#ecfdf5",
        },
    },
    {
        id: "database",
        name: "Database",
        color: "#ec4899",
        colors: {
            eventColor: "rgba(236, 72, 153, 0.15)",
            eventSelectedColor: "#ec4899",
            lineColor: "#ec4899",
            textColor: "#831843",
        },
        darkColors: {
            eventColor: "rgba(244, 114, 182, 0.28)",
            eventSelectedColor: "#f472b6",
            lineColor: "#f9a8d4",
            textColor: "#fce7f3",
        },
    },
    {
        id: "project",
        name: "Capstone Project",
        color: "#14b8a6",
        colors: {
            eventColor: "rgba(20, 184, 166, 0.15)",
            eventSelectedColor: "#14b8a6",
            lineColor: "#14b8a6",
            textColor: "#115e59",
        },
        darkColors: {
            eventColor: "rgba(45, 212, 191, 0.25)",
            eventSelectedColor: "#5eead4",
            lineColor: "#99f6e4",
            textColor: "#ccfbf1",
        },
    },
];

const getWebsiteCalendars = (): CalendarType[] =>
    CALENDAR_SIDE_PANEL.map((item) => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
        colors: {
            eventColor: `${item.color}30`,
            eventSelectedColor: `${item.color}`,
            lineColor: item.color,
            textColor: item.color,
        },
        isVisible: true,
    }));

export default function Home() {
    const [customCalendars, setCustomCalendars] = useState<CalendarType[]>([]);

    const baseCalendars = getWebsiteCalendars();

    const calendarsWithGroups = useMemo(() => {
        const frontend = new Set(["frontend", "javascript", "react", "typescript"]);
        const backend = new Set(["backend", "database", "project"]);
        return [...baseCalendars, ...customCalendars].map((cal) => {
            if (cal.source) return cal;

            return {
                ...cal,
                source: frontend.has(cal.id)
                    ? "Frontend"
                    : backend.has(cal.id)
                        ? "Backend"
                        : undefined,
            };
        });
    }, [customCalendars]);

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

    const calendarRef = useRef<CalendarHandle | null>(null);

    const calendar = useCalendarApp({
        views: [createDayView(), createWeekView(), createMonthView()],
        plugins: [
            createDragPlugin(),
            createEventsPlugin(),
            createSidebarPlugin({
                createCalendarMode: "modal",
                showEventDots: true,
            }),
        ],
        calendars: calendarsWithGroups,

        events: [
            createEvent({ id: "ev-1", title: "HTML Fundamentals", start: new Date(2026, 3, 22, 10, 0), end: new Date(2026, 3, 22, 11, 30), calendarId: "frontend" }),
            createEvent({ id: "ev-2", title: "CSS Layouts & Flexbox", start: new Date(2026, 3, 28, 9, 0), end: new Date(2026, 3, 28, 10, 30), calendarId: "frontend" }),
            createEvent({ id: "ev-3", title: "Responsive Design", start: new Date(2026, 4, 5, 14, 0), end: new Date(2026, 4, 5, 15, 0), calendarId: "frontend" }),
            createEvent({ id: "ev-4", title: "Frontend Mini Project", start: new Date(2026, 4, 12, 16, 0), end: new Date(2026, 4, 12, 17, 0), calendarId: "frontend" }),
            createEvent({ id: "ev-5", title: "JavaScript Basics", start: new Date(2026, 3, 24, 9, 0), end: new Date(2026, 3, 24, 10, 0), calendarId: "javascript" }),
            createEvent({ id: "ev-6", title: "ES6 Features", start: new Date(2026, 4, 2, 12, 30), end: new Date(2026, 4, 2, 13, 30), calendarId: "javascript" }),
            createEvent({ id: "ev-7", title: "DOM Manipulation", start: new Date(2026, 4, 9, 19, 0), end: new Date(2026, 4, 9, 21, 30), calendarId: "javascript" }),
            createEvent({ id: "ev-8", title: "React Components", start: new Date(2026, 3, 25, 18, 0), end: new Date(2026, 3, 25, 20, 0), calendarId: "react" }),
            createEvent({ id: "ev-9", title: "React Hooks", start: new Date(2026, 4, 7, 9, 0), end: new Date(2026, 4, 7, 12, 0), calendarId: "react" }),
            createEvent({ id: "ev-10", title: "State Management", start: new Date(2026, 4, 14, 20, 0), end: new Date(2026, 4, 14, 22, 0), calendarId: "react" }),
            createEvent({ id: "ev-11", title: "TypeScript Basics", start: new Date(2026, 4, 3, 6, 0), end: new Date(2026, 4, 3, 14, 0), calendarId: "typescript" }),
            createEvent({ id: "ev-12", title: "Type Safety & Interfaces", start: new Date(2026, 4, 3, 15, 0), end: new Date(2026, 4, 3, 16, 0), calendarId: "typescript" }),
            createEvent({ id: "ev-13", title: "Node.js Fundamentals", start: new Date(2026, 3, 23, 6, 30), end: new Date(2026, 3, 23, 7, 15), calendarId: "backend" }),
            createEvent({ id: "ev-14", title: "Express.js Routing", start: new Date(2026, 3, 26, 8, 0), end: new Date(2026, 3, 26, 9, 0), calendarId: "backend" }),
            createEvent({ id: "ev-15", title: "REST API Development", start: new Date(2026, 4, 6, 11, 0), end: new Date(2026, 4, 6, 12, 0), calendarId: "backend" }),
            createEvent({ id: "ev-16", title: "MongoDB Basics", start: new Date(2026, 3, 27, 10, 0), end: new Date(2026, 3, 27, 11, 30), calendarId: "database" }),
            createEvent({ id: "ev-17", title: "Database Relationships", start: new Date(2026, 4, 8, 13, 0), end: new Date(2026, 4, 8, 17, 0), calendarId: "database" }),
            createEvent({ id: "ev-18", title: "Capstone Planning", start: new Date(2026, 3, 29, 14, 0), end: new Date(2026, 3, 29, 15, 0), calendarId: "project" }),
            createEvent({ id: "ev-19", title: "Full Stack Project Build", start: new Date(2026, 4, 4, 9, 0), end: new Date(2026, 4, 4, 9, 30), calendarId: "project" }),
            createEvent({ id: "ev-20", title: "Final Project Presentation", start: new Date(2026, 4, 13, 15, 0), end: new Date(2026, 4, 13, 16, 0), calendarId: "project" }),
        ],
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

                const processedCalendar: CalendarType = {
                    ...newCalendar,
                    name: newCalendar.name,
                    source,
                };

                setCustomCalendars((prev) => [...prev, processedCalendar]);
            },
            onEventCreate: (event) => {
                console.log("[calendar] onEventCreate", event);
            },
            onEventUpdate: (event) => {
                console.log("[calendar] onEventUpdate", event);
            },
            onEventDelete: (eventId) => {
                console.log("[calendar] onEventDelete", { eventId });
            },
        },
    });

    useEffect(() => {
        calendarRef.current = calendar;
    });

    return (
        <div className="w-full h-full">
            <DayFlowCalendar calendar={calendar} />
        </div>
    );
}