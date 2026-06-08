"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Calendar,
    Element2,
    Stickynote,
    TaskSquare,
} from "iconsax-react"
import { SidebarMenuItem } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

const menuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: Element2,
        roles: ["teacher", "student"],
    },
    {
        title: "Assessment",
        href: "/assessment",
        icon: TaskSquare,
        roles: ["teacher", "student"],
    },
    {
        title: "Calendar",
        href: "/calendar",
        icon: Calendar,
        roles: ["teacher", "student"],
    },
    {
        title: "Report",
        href: "/report",
        icon: Stickynote,
        roles: ["teacher"],
    },
]

export default function SidebarTitle() {
    const pathname = usePathname()
    const session = useSession()

    const role = session?.data?.user?.role

    const filteredMenu = menuItems.filter((item) =>
        role ? item.roles.includes(role) : false
    )

    return (
        <>
            {filteredMenu.map((menuItem) => {
                const isActive = pathname.startsWith(menuItem.href)
                const Icon = menuItem.icon

                return (
                    <SidebarMenuItem className="w-full" key={menuItem.href}>
                        <Link
                            href={menuItem.href}
                            className={`flex items-center gap-5 px-4 py-2 text-primary 
              ${isActive
                                    ? "bg-linear-purple rounded-[10px] text-white"
                                    : "hover:bg-gray rounded-[10px]"
                                }`}
                        >
                            <Icon color={isActive ? "white" : "black"} size={20} />
                            <span>{menuItem.title}</span>
                        </Link>
                    </SidebarMenuItem>
                )
            })}
        </>
    )
}