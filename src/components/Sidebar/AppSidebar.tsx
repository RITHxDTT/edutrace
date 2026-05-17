"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";
import Image from "next/image";
import {
  Calendar,
  Element2,
  LoginCurve,
  Stickynote,
  TaskSquare,
} from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function AppSidebar() {
  const pathname: string = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-center">
          <Image
            width={0}
            height={0}
            src={"/images/logo/growthyflow-logo.png"}
            alt="Growthyflow Logo"
            className="w-5 h-5"
            unoptimized
          />
          <span className="text-[26px] font-semibold text-transparent bg-clip-text bg-linear-purple">
            rowthyFlow
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex flex-col items-center gap-5.25 px-5">
          {menuItems.map((menuItem, index) => {
            const isActive = pathname === menuItem.href;
            const Icon = menuItem.icon;

            return (
              <SidebarMenuItem key={index} className="w-full">
                <Link
                  href={menuItem.href}
                  className={`flex items-center gap-5 px-4 py-2 text-primary 
                ${isActive ? " bg-linear-purple rounded-[10px] text-white" : " hover:bg-gray rounded-[10px]"}`}
                >
                  <div>
                    <Icon color={isActive ? "white" : "black"} size={20} />
                  </div>

                  <span>{menuItem.title}</span>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <SidebarFooter className="w-full px-5">
          <Link href={"/logout"} className="flex items-center px-4 gap-5">
            <LoginCurve color="#E62020" size={20} />
            <span className="text-red">Logout</span>
          </Link>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
