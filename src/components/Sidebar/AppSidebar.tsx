'use client'
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem } from '../ui/sidebar'
import Image from 'next/image'
import { Calendar, Element2, TaskSquare } from 'iconsax-react'

const menuItems = [
    { title: "Dashboard", href: "/dashboard", icon: <Element2 color="black" size={24} /> },
    { title: "Assessment", href: "/assessment", icon: <TaskSquare color="black" size={24} /> },
    { title: "Calendar", href: "/calendar", icon: <Calendar color="black" size={24} /> }
]

export default function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='flex justify-center'>
                    <Image
                        width={0}
                        height={0}
                        src={"/images/logo/growthyflow-logo.png"}
                        alt='Growthyflow Logo'
                        className='w-20 h20'
                        unoptimized
                    />
                    <span className='text-[26px] font-semibold'>Growthyflow</span>
                </div>
            </SidebarHeader>
            <SidebarMenu className='flex flex-col gap-5.25'>
                {menuItems.map((menuItem, index) => (
                    <SidebarMenuItem key={index} className='flex gap-2.5 justify-center'>
                        {menuItem.icon}
                        <span>{menuItem.title}</span>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </Sidebar>
    )
}