"use client";

import { useMemo, useState } from "react";
import { useAppNotifications } from "@/components/notifications/useAppNotifications";
import NotificationItem from "./NotificationItem";

export default function NotificationDropdown() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const { notifications, unreadCount, markAllAsRead, markAsRead } = useAppNotifications();

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") return notifications.filter((n) => !n.isRead);
    return notifications;
  }, [activeTab, notifications]);

  return (
    <div className="font-sans pb-4 bg-white ">
      <div className="p-6 pb-2">
        <h2 className="text-[26px] font-bold text-gray-950 tracking-tight mb-4">
          All Notifications
        </h2>

        <div className="flex items-center justify-between border-b border-gray-100/80">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 text-base font-bold relative transition-colors cursor-pointer ${
                activeTab === "all" ? "text-gray-950" : "text-gray-400"
              }`}
            >
              All
              {activeTab === "all" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-950 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("unread")}
              className={`pb-3 text-base font-bold relative transition-colors cursor-pointer ${
                activeTab === "unread" ? "text-gray-950" : "text-gray-400"
              }`}
            >
              Unread ({unreadCount})
              {activeTab === "unread" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-950 rounded-full" />
              )}
            </button>
          </div>

          <button
            onClick={markAllAsRead}
            className="pb-3 text-sm font-bold text-main-linear cursor-pointer hover:underline transition-colors"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="max-h-[440px] overflow-y-auto pr-1">
        {filteredNotifications.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">
            No notifications
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <NotificationItem 
              key={n.notificationId} 
              notification={n} 
              onClick={markAsRead} 
            />
          ))
        )}
      </div>
    </div>
  );
}