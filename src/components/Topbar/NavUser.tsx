"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import LogoutButton from "../Sidebar/_components/LogoutButton"
import { ArrowSwapVertical, ProfileCircle } from "iconsax-react"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"

type NavUserProps = {
    session: Session;
}

function getInitials(fullName?: string | null) {
    if (!fullName) return "U"
    return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
}

export function NavUser({ session }: NavUserProps) {
    const router = useRouter()
    const user = session.user
    const { isMobile } = useSidebar()
    const initials = getInitials(user?.fullName)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 outline-none hover:bg-[#EEEFFF] transition-colors cursor-pointer">
                <Avatar className="h-9 w-9 shrink-0 rounded-xl">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.fullName} />
                    <AvatarFallback
                        className="rounded-xl text-sm font-semibold text-white"
                        style={{ background: "linear-gradient(to bottom, #241cab 37%, #5d53f9 82%)" }}
                    >
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold leading-tight text-gray-800">
                        {user?.fullName}
                    </p>
                    <p className="truncate text-xs leading-tight text-gray-500">
                        {user?.email}
                    </p>
                </div>
                <ArrowSwapVertical size={16} className="shrink-0 text-gray-400" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="min-w-64 overflow-hidden rounded-xl border border-gray-100 p-0 shadow-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={8}
            >
                {/* Gradient header */}
                <div
                    className="flex items-center gap-3 px-4 py-3.5"
                >
                    <Avatar className="h-10 w-10 shrink-0 rounded-xl border-2 border-white/30">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.fullName} />
                        <AvatarFallback className="rounded-xl bg-white/20 font-semibold ">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-tight ">
                            {user?.fullName}
                        </p>
                        <p className="truncate text-xs leading-tight">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => router.push("/profile")}
                            className="flex items-center px-4 py-1 gap-5 cursor-pointer rounded-lg"
                        >
                            <ProfileCircle size={20} color="#6B7280" />
                            <span>View Profile</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </div>

                <DropdownMenuSeparator className="my-0" />

                <div className="p-1.5">
                    <div className="w-full rounded-lg hover:bg-red-50 transition-colors">
                        <LogoutButton />
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
