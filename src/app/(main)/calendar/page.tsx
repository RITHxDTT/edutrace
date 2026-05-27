import NavbarTitle from '@/components/Topbar/NavbarTitle'
import CalendarEventComponent from './_components/CalendarEventComponent'

export default function page() {
  return (
    <div>
      <NavbarTitle title="Calendar" override />
      <CalendarEventComponent />
    </div>
  )
}