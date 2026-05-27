
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";
import Image from "next/image";
import { SignOut } from "../AuthComponents";
import SidebarTitle from "./_components/SidebarTitle";

export default function AppSidebar() {

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
        <SidebarFooter className="w-full px-5">
          <SignOut />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
