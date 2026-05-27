"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Calendar,
    Element2,
    Stickynote,
    TaskSquare,
} from "iconsax-react";
import { SidebarMenuItem } from "@/components/ui/sidebar";

const menuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: Element2,
    },
    {
        title: "Assessment",
        href: "/assessment",
        icon: TaskSquare,
    },
    {
        title: "Calendar",
        href: "/calendar",
        icon: Calendar,
    },
    {
        title: "Report",
        href: "/report",
        icon: Stickynote,
    },
];

export default function SidebarTitle() {
    const pathname = usePathname();
    return (
        <>
            {menuItems.map((menuItem) => {
                const isActive = pathname.startsWith(menuItem.href);
                const Icon = menuItem.icon

                return (
                    <SidebarMenuItem className="w-full" key={menuItem.href}>
                        <Link
                            href={menuItem.href}
                            className={`flex items-center gap-5 px-4 py-2 text-primary 
                        ${isActive ? "bg-linear-purple rounded-[10px] text-white" : "hover:bg-gray rounded-[10px]"}`}
                        >
                            <div>
                                <Icon color={isActive ? "white" : "black"} size={20} />
                            </div>
                            <span>{menuItem.title}</span>
                        </Link>
                    </SidebarMenuItem>
                );
            })}
        </>
    );
}


