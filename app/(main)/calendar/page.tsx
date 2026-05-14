import CalendarEventComponent from '@/_components/CalendarEventComponent'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: "HRDRoom - Calendar",
    icons: "/images/logo/hrdroom-logo.jpg",
}

export default function Page() {
    return (
        <div>
            <CalendarEventComponent />
        </div>
    )
}
