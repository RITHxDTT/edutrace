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
import { motion } from "framer-motion"

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
                            className={`relative flex items-center gap-5 px-4 py-2 rounded-[10px] overflow-hidden ${
                                isActive ? "text-white" : "text-primary hover:bg-gray"
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active-indicator"
                                    className="absolute inset-0 bg-linear-purple rounded-[10px]"
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                />
                            )}
                            <span className="relative z-10">
                                <Icon color={isActive ? "white" : "black"} size={20} />
                            </span>
                            <span className="relative z-10">{menuItem.title}</span>
                        </Link>
                    </SidebarMenuItem>
                )
            })}
        </>
    )
}