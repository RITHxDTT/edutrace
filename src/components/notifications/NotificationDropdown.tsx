"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/components/notifications/useNotificationStore";

export default function NotificationDropdown() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const notifications = useNotificationStore((state) => state.notifications);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [activeTab, notifications]);

  return (
    <div className="absolute right-[-150px] top-12 w-[520px] rounded-2xl bg-white shadow-2xl border overflow-hidden z-[9999]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <h2 className="text-base font-semibold text-gray-800">Notifications</h2>

        <button
          onClick={markAllAsRead}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Mark all as read
        </button>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1 text-sm rounded-full transition ${
            activeTab === "all"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveTab("unread")}
          className={`px-3 py-1 text-sm rounded-full transition flex items-center gap-2 ${
            activeTab === "unread"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-[2px] rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* LIST */}
      <div className="max-h-[380px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">
            No notifications
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.notificationId}
              className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  n.isRead
                    ? "bg-gray-100 text-gray-500"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>

              {/* content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3
                    className={`text-sm font-medium ${
                      n.isRead ? "text-gray-700" : "text-black"
                    }`}
                  >
                    {n.title}
                  </h3>

                
                  <p className="text-[11px] text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: false,
                    })}
                  </p>
                </div>

                <p className="text-xs text-gray-500 mt-0.5">{n.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
