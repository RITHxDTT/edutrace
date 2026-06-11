import NavbarTitle from '@/components/Topbar/NavbarTitle'
import CalendarEventComponent from './_components/CalendarEventComponent'
import { getMyCalendarAction } from '@/actions/calendar.action';
import { EventType } from '@/types/calendar';
export const dynamic = 'force-dynamic';
export default async function page() {
  const allevents: EventType[] = await getMyCalendarAction();

  return (
    <div>
      <NavbarTitle title="Calendar" override />
      <CalendarEventComponent allevents={allevents} />
    </div>
  )
}