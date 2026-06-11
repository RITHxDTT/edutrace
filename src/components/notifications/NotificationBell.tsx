"use client";

import { useState } from "react";
import { useAppNotifications } from "@/components/notifications/useAppNotifications";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Notification } from "iconsax-react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useAppNotifications();

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        className="z-[9999] w-[calc(100vw-24px)] max-w-[460px] overflow-hidden rounded-[18px] border border-gray-100/70 bg-white p-0 shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:rounded-[24px]"
      >
        <NotificationDropdown onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
