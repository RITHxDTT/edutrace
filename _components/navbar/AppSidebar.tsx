"use client";
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Calendar, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { FaTasks } from 'react-icons/fa'
import { GoReport } from 'react-icons/go'
import { RxDashboard } from 'react-icons/rx'

const links = [
  { title: "Dashboard", icon: <RxDashboard className="size-6" />, href: '/dashboard' },
  { title: "Task", icon: <FaTasks size={24} />, href: '/tasks' },
  { title: "Calendar", icon: <Calendar size={24} />, href: '/calendar' },
  { title: "Report", icon: <GoReport />, href: '/reports' },
  { title: "Logout", icon: <LogOut />, href: '/logout' },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className='rounded-tr-xl bg-white'>
      <SidebarHeader>
        <Link className='flex justify-center items-center gap-3' href={"/"}>
          <Image
            src={"/images/logo/hrdroom-logo.jpg"}
            width={0} height={0}
            className='w-10 h-12'
            unoptimized
            alt='HRDRoom Logo' />
          <p className="text-2xl font-medium">
            <span className="bg-accent-linear-purple bg-clip-text text-transparent"> HRD </span>
            {" "}Room
          </p>
        </Link>
      </SidebarHeader>
      <SidebarMenu className={"flex flex-col gap-3.5 px-1 mt-10"}>
        {links.map((link, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton className={`p-6 ${pathname === link.href ? 'bg-accent-linear-purple ' : ' '}`}>
              <Link className={`flex items-center gap-3 ${pathname === link.href ? 'text-white' : 'text-muted'} text-xl`} href={link.href}>
                <div className="flex items-center justify-center [&_svg]:!size-6">
                  {link.icon}
                </div>
                {link.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </Sidebar>
  )
}
