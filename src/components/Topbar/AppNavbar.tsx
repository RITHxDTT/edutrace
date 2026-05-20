"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { getRoute } from "@/utils/getRouteLabel";
import { useNavbar } from "@/context/NavbarContext";
import { useEffect } from "react";

export default function AppNavbar() {
  const { title } = useNavbar();

  return (
    <header>
      <nav className="py-5 px-5">
        <div className="flex items-center gap-5">
          <SidebarTrigger />
          <span className="text-[24px] font-medium text-transparent bg-clip-text bg-linear-purple ">
            {title}
          </span>
        </div>
      </nav>
    </header>
  );
}
