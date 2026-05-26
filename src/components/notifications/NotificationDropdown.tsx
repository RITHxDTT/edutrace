"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, MessageSquare, Plus, Upload } from "lucide-react"; // Match fallback icons
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

  // Helper helper function to return dynamic icons or avatars based on notification content
  const renderNotificationIcon = (n: any) => {
    if (n.senderAvatar) {
      return (
        <img
          src={n.senderAvatar}
          alt="Sender"
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />
      );
    }

    // Dynamic clean background & icons matching the premium image design
    let bgClass = "bg-green-50 text-green-600";
    let IconComponent = Bell;

    if (n.title?.toLowerCase().includes("assignment") || n.title?.toLowerCase().includes("publish")) {
      bgClass = "bg-emerald-50 text-emerald-600";
      IconComponent = Plus;
    } else if (n.title?.toLowerCase().includes("feedback") || n.title?.toLowerCase().includes("mention")) {
      bgClass = "bg-emerald-50 text-emerald-600";
      IconComponent = MessageSquare;
    } else if (n.title?.toLowerCase().includes("upload")) {
      bgClass = "bg-emerald-50 text-emerald-600";
      IconComponent = Upload;
    }

    return (
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bgClass}`}>
        <IconComponent className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="absolute right-[-150px] top-12 w-[500px] rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden z-[9999] font-sans">
      
      {/* HEADER SECTION */}
      <div className="px-6 pt-6 pb-2 bg-white">
        <h2 className="text-2xl font-bold text-slate-900">All Notifications</h2>
      </div>

      {/* TABS SECTION */}
      <div className="flex items-center justify-between px-6 border-b border-gray-100 bg-white">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 text-sm font-semibold relative transition-colors ${
              activeTab === "all" ? "text-slate-900" : "text-gray-400 hover:text-slate-600"
            }`}
          >
            All
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("unread")}
            className={`pb-3 text-sm font-semibold relative transition-colors ${
              activeTab === "unread" ? "text-slate-900" : "text-gray-400 hover:text-slate-600"
            }`}
          >
            Unread ({unreadCount})
            {activeTab === "unread" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900 rounded-full" />
            )}
          </button>
        </div>

        <button
          onClick={markAllAsRead}
          className="pb-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="max-h-[440px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">
            No notifications
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.notificationId}
              className={`flex items-center gap-4 px-6 py-4 border-b border-gray-50/60 transition-colors cursor-pointer ${
                !n.isRead ? "bg-slate-50/50" : "bg-white hover:bg-slate-50/30"
              }`}
            >
              {/* Left Aspect: Avatar or Round Visual */}
              {renderNotificationIcon(n)}

              {/* Middle Aspect: Main Content details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">
                  {n.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {n.content}
                </p>
              </div>

              {/* Right Aspect: Relative Time Stamp */}
              <div className="text-xs text-gray-400 whitespace-nowrap pl-2 self-start pt-1">
                {formatDistanceToNow(new Date(n.createdAt), {
                  addSuffix: true,
                }).replace("about ", "")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}