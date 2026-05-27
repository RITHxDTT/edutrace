"use client";

import { useState } from "react";
import { useNotificationStore } from "@/components/notifications/useNotificationStore";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { Notification } from "iconsax-react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const unreadCount = useNotificationStore((state) =>
    state.notifications.filter((n) => !n.isRead).length,
  );

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative cursor-pointer">
        <Notification className="w-8 h-8" size={32} color="black" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-linear-purple text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationDropdown />}
    </div>
  );
}