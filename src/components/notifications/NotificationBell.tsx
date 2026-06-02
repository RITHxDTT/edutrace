"use client";

import { useAppNotifications } from "@/components/notifications/useAppNotifications";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Notification } from "iconsax-react";

export default function NotificationBell() {
  const { unreadCount } = useAppNotifications();

  return (
    <Popover>
      <PopoverTrigger className="relative cursor-pointer focus:outline-none bg-transparent border-none p-0 flex items-center justify-center">
        <Notification className="w-8 h-8" size={32} color="black" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-linear-purple text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent 
        align="end" 
        sideOffset={12}
        className="w-[460px] rounded-[28px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100/50 p-0 overflow-hidden z-[9999]"
      >
        <NotificationDropdown />
      </PopoverContent>
    </Popover>
  );
}