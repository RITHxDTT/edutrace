import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "../ui/sidebar";
import Image from "next/image";
import SidebarTitle from "./_components/SidebarTitle";
import { NavUser } from "@/components/Topbar/NavUser";
import { auth } from "@/auth";

export default async function AppSidebar() {
  const session = await auth();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-baseline items justify-center">
          <Image
            width={0}
            height={0}
            src={"/images/logo/edutraceLogo.png"}
            alt="Growthyflow Logo"
            className="w-60 h-20 object-contain"
            unoptimized
            loading="eager"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex flex-col items-center gap-5.25 px-5">
          <SidebarTitle />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-2 pb-3">
        {session && <NavUser session={session} />}
      </SidebarFooter>
    </Sidebar>
  );
}
