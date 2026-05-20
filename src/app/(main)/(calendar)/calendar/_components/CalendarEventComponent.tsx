"use client"
import {
  DayFlowCalendar,
  useCalendarApp,
  createWeekView,
  createDayView,
  createMonthView, createEventsPlugin, createYearView,
} from '@dayflow/react';
import {CalendarSidebarRenderProps, createSidebarPlugin} from '@dayflow/plugin-sidebar';
import {createDragPlugin} from "@dayflow/plugin-drag";
const CustomSidebar = ({
                         app,
                         calendars,
                         toggleCalendarVisibility,
                         isCollapsed,
                         setCollapsed,
                       }: CalendarSidebarRenderProps) => {
  if (isCollapsed) {
    return (
        <div className='p-2'>
          <button onClick={() => setCollapsed(false)}>→</button>
        </div>
    );
  }
  return (
      <aside className='flex h-full flex-col gap-4 p-4 bg-slate-50 border-r'>
        <header className='flex items-center justify-between'>
          <h3 className='font-semibold'>My Workspace</h3>
          <button onClick={() => setCollapsed(true)}>←</button>
        </header>
        <nav className='space-y-1'>
          {calendars.map(calendar => (
              <label
                  key={calendar.id}
                  className='flex items-center gap-2 cursor-pointer'
              >
                <input
                    type='checkbox'
                    checked={calendar.isVisible}
                    onChange={e =>
                        toggleCalendarVisibility(calendar.id, e.target.checked)
                    }
                />
                <span
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: calendar.colors.lineColor }}
                />
                {calendar.name}
              </label>
          ))}
        </nav>
        <div className='mt-auto pt-4 border-t text-xs text-slate-500'>
          Total Events: {app.getEvents().length}
        </div>
      </aside>
  );
};
const sidebarPlugin = createSidebarPlugin({
  render: props => <CustomSidebar {...props} />,
});
export default function CalendarEventComponent() {
  const calendar = useCalendarApp({
    views: [createDayView(), createWeekView(), createMonthView()],
    plugins: [
        createDragPlugin(),
        createEventsPlugin(),
        createSidebarPlugin({
            createCalendarMode: "modal",
            showEventDots: true,
            render: ({ calendars, toggleCalendarVisibility }) => {
                const groupedCalendars = calendars.reduce<Record<string, typeof calendars>>(
                    (groups, calendar) => {
                        const groupName = calendar.source ?? "Other";
                        if (!groups[groupName]) {
                            groups[groupName] = [];
                        }
                        groups[groupName].push(calendar);
                        return groups;
                    },
                    {}
                );

                return (
                    <div className="h-full w-full p-4 border-r bg-background">
                        <div className="space-y-5">
                            {Object.entries(groupedCalendars).map(
                                ([groupName, groupCalendars]) => (
                                    <div key={groupName}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-semibold text-muted-foreground">
                                                {groupName}
                                            </h3>

                                            <button
                                                type="button"
                                                className="flex h-6 w-6 items-center justify-center rounded-md text-sm hover:bg-muted"
                                                onClick={() => {
                                                    console.log("Add calendar to:", groupName);
                                                    // open your add calendar modal here
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {groupCalendars.map(calendar => (
                                                <label
                                                    key={calendar.id}
                                                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={calendar.isVisible}
                                                        onChange={event =>
                                                            toggleCalendarVisibility(
                                                                calendar.id,
                                                                event.target.checked
                                                            )
                                                        }
                                                    />

                                                    <span
                                                        className="h-3 w-3 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                // calendar.colors?.main ??
                                                                calendar.colors?.lineColor,
                                                        }}
                                                    />

                                                    <span className="text-sm">{calendar.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                );
            },
        })
    ],



  });
  return <DayFlowCalendar calendar={calendar} />;
}
