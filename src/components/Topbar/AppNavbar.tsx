"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { useNavbar } from "@/context/NavbarContext";
import { ProfileData } from "@/types/user";
import { Session } from "next-auth";
import NotificationBell from "../notifications/NotificationBell";
import ProfileFormClient from "@/app/(main)/profile/_Components/ProfileFormClient";
import UserProfile from "@/app/(main)/profile/_Components/UserProfile";

export default function AppNavbar({ payload }: { payload: Session | null }) {
  const { title } = useNavbar();
  const fullName = payload?.user?.name;
  const email = payload?.user?.email;
  const ImageUrl = payload?.user?.profileImageUrl
    ? payload.user.profileImageUrl
    : "";

  return (
    <header>
      <nav className="py-5 px-5 ">
        <div className="flex justify-between items-center ">
          <div className="flex items-center gap-5">
            <SidebarTrigger />
            <span className="text-[24px] font-medium text-transparent bg-clip-text bg-linear-purple ">
              {title}
            </span>
          </div>
          {/* Profile Info */}
          <div className="flex items-center gap-5 justify-end" >
            <NotificationBell />
            {/* user profile  */}
            <UserProfile />
          </div>

        </div>
      </nav>
    </header>
  );
}
