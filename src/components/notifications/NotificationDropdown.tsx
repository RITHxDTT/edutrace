"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { Bell, MessageSquare, Plus, Upload } from "lucide-react";
import { useNotificationStore } from "@/components/notifications/useNotificationStore";

interface NotificationItem {
  notificationId: string | number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderAvatar?: string;
}


let cachedNow = Date.now();

const timeStore = {
  subscribe(cb: () => void) {
    const interval = setInterval(() => {
      cachedNow = Date.now(); 
      cb();
    }, 60000); 
    return () => clearInterval(interval);
  },
  getSnapshot() {
    return cachedNow; 
  },
  getServerSnapshot() {
    return null;
  }
};

function RelativeTime({ createdAt }: { createdAt: string }) {
  const now = useSyncExternalStore(timeStore.subscribe, timeStore.getSnapshot, timeStore.getServerSnapshot);

  if (!now) return <span className="text-[13px] font-medium text-gray-400">...</span>;

  const created = parseAbsoluteToLocal(createdAt).toDate().getTime();
  const diffInSeconds = Math.floor((created - now) / 1000);
  const absSeconds = Math.abs(diffInSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { style: "short", numeric: "always" });

  let timeText = "";
  if (absSeconds < 60) {
    timeText = rtf.format(diffInSeconds, "second");
  } else {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const absMinutes = Math.abs(diffInMinutes);
    if (absMinutes < 60) {
      timeText = rtf.format(diffInMinutes, "minute");
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      const absHours = Math.abs(diffInHours);
      if (absHours < 24) {
        timeText = rtf.format(diffInHours, "hour");
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        timeText = rtf.format(diffInDays, "day");
      }
    }
  }

  return <div className="text-[13px] font-medium text-disabled whitespace-nowrap pl-2 pt-1 self-start">{timeText}</div>;
}

export default function NotificationDropdown() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const notifications = useNotificationStore((state) => state.notifications) as NotificationItem[];
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") return notifications.filter((n) => !n.isRead);
    return notifications;
  }, [activeTab, notifications]);

  const renderNotificationIcon = (n: NotificationItem) => {
    const bgClass = "bg-[#E8F8F4] text-[#10B981]";
    let IconComponent = Bell;

    if (n.title?.toLowerCase().includes("assignment")) IconComponent = Plus;
    else if (n.title?.toLowerCase().includes("feedback")) IconComponent = MessageSquare;
    else if (n.title?.toLowerCase().includes("upload")) IconComponent = Upload;

    return (
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bgClass}`}>
        <IconComponent className="w-5 h-5" strokeWidth={2.5} />
      </div>
    );
  };

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
            <div
              key={n.notificationId}
              className="flex items-start gap-4 px-6 py-[14px] hover:bg-slate-50/50 transition-colors cursor-pointer"
            >
              {renderNotificationIcon(n)}
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-[15px] font-bold text-gray-900 leading-snug">
                  {n.title}
                </h3>
                <p className="text-[13px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                  {n.content}
                </p>
              </div>
              <RelativeTime createdAt={n.createdAt} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}