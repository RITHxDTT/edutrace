"use client";
import {
  DayFlowCalendar,
  useCalendarApp,
  createWeekView,
  createDayView,
  createMonthView,
  createEventsPlugin,
  createYearView,
} from "@dayflow/react";
import {
  CalendarSidebarRenderProps,
  createSidebarPlugin,
} from "@dayflow/plugin-sidebar";
import { createDragPlugin } from "@dayflow/plugin-drag";
import { useEffect, useRef, useMemo } from "react";

export function getWebsiteCalendars() {
  return [
    { id: "team", name: "Team" },
    { id: "personal", name: "Personal" },
    { id: "learning", name: "Learning" },
    { id: "travel", name: "Travel" },
    { id: "wellness", name: "Wellness" },
    { id: "marketing", name: "Marketing" },
    { id: "support", name: "Support" },
  ];
}

export default function CalendarEventComponent() {
  const calendarTypes = getWebsiteCalendars();
  const calendarsWithGroups = useMemo(() => {
    const googleIds = new Set(["team", "personal", "learning", "travel"]);
    const icloudIds = new Set(["wellness", "marketing", "support"]);
    return calendarTypes.map((cal) => ({
      ...cal,
      source: googleIds.has(cal.id)
        ? "Google"
        : icloudIds.has(cal.id)
          ? "iCloud"
          : undefined,
    }));
  }, []);

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

          // Open DayFlow context menu off-screen
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

            // Hide/remove the intermediate context menu
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
    initialDate: new Date(),
    callbacks: {
      onMoreEventsClick: (date: Date) => {
        calendarRef.current?.selectDate(date);
        calendarRef.current?.setCurrentDate(date);
        calendarRef.current?.changeView(ViewType.DAY);
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
  }, [calendar]);

  return (
    <div style={{ height: "100vh" }}>
      <DayFlowCalendar calendar={calendar} />
    </div>
  );
}
