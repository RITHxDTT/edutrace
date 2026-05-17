"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { firstCharUppercase } from "@/utils/firstCharUppercase";

export default function AppNavbar() {
  const pathname = usePathname();

  return (
    <header>
      <nav className="py-5 px-5">
        <div className="flex items-center gap-5">
          <SidebarTrigger />
          <span className="text-[24px] font-medium text-transparent bg-clip-text bg-linear-purple ">
            {firstCharUppercase(pathname, 1)}
          </span>
        </div>
      </nav>
    </header>
  );
}
