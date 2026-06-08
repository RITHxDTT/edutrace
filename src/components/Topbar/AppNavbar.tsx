"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { useNavbar } from "@/context/NavbarContext";
import NotificationBell from "../notifications/NotificationBell";
import UserProfile from "@/app/(main)/profile/_components/UserProfile";


export default function AppNavbar() {
  const { title, isSticky } = useNavbar();

  return (
    <header className={`${isSticky ? "sticky top-0" : ""} z-50 bg-transparent`}>
      <nav className="py-3 sm:py-5 px-4 sm:px-5">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-5 min-w-0">
            <SidebarTrigger className="shrink-0" />
            <span className="text-base sm:text-[24px] font-medium text-transparent bg-clip-text bg-linear-purple truncate">
              {title}
            </span>
          </div>
          {/* Profile Info */}
          <div className="flex items-center gap-2 sm:gap-5 justify-end shrink-0">
            <NotificationBell />
            {/* user profile  */}
            <UserProfile />
          </div>
        </div>
      </nav>
    </header>
  );
}
