"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { useNotificationStore } from "@/components/notifications/useNotificationStore";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  
  const notifications = useNotificationStore(
    (state) => state.notifications,
  );

  const unreadCount = useNotificationStore((state) =>
    state.notifications.filter((n) => !n.isRead).length,
  );

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-6 h-6" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationDropdown />}
    </div>
  );
}