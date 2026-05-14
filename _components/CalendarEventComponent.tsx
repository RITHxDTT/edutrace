"use client"
import { createDragPlugin } from '@dayflow/plugin-drag'
import { CreateCalendarDialog, createDayView, createEventsPlugin, createMonthView, createWeekView, DayFlowCalendar, useCalendarApp } from '@dayflow/react'

export default function CalendarEventComponent() {
  const calendar = useCalendarApp({
    views: [createDayView(), createWeekView(), createMonthView()],
    plugins: [createDragPlugin(), createEventsPlugin()],
  })

  return (
    <div>
      <DayFlowCalendar calendar={calendar} />
    </div>
  )
}
