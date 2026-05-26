"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { useNavbar } from "@/context/NavbarContext";
import { ProfileData } from "@/types/user";
import { Session } from "next-auth";

export default function AppNavbar({ payload }: { payload: Session | null }) {
  const { title } = useNavbar();
  const fullName = payload?.user?.name;
  const email = payload?.user?.email;
  const ImageUrl = payload?.user?.profileImageUrl ? payload.user.profileImageUrl : ""

  return (
    <header>
      <nav className="py-5 px-5">
        <div className="flex items-center gap-5">
          <SidebarTrigger />
          <span className="text-[24px] font-medium text-transparent bg-clip-text bg-linear-purple ">
            {title}
          </span>
          {/* Profile Info */}
          <div>

          </div>
        </div>
      </nav>
    </header>
  );
}
