"use client";

import { Bell, MessageSquare, Plus, Upload } from "lucide-react";
import { MappedNotification } from "@/components/notifications/notification.utils";
import RelativeTime from "./RelativeTime";

interface NotificationItemProps {
  notification: MappedNotification;
  onClick: (notification: MappedNotification) => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const renderNotificationIcon = (n: MappedNotification) => {
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
    <div
      onClick={() => onClick(notification)}
      className={`flex items-start gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors cursor-pointer ${
        !notification.isRead ? "bg-slate-50/10 font-semibold" : "opacity-80"
      }`}
    >
      {renderNotificationIcon(notification)}
      <div className="flex-1 min-w-0 pt-0.5">
        <h3 className={`text-[15px] leading-snug ${!notification.isRead ? "font-bold text-gray-950" : "font-medium text-gray-700"}`}>
          {notification.title}
        </h3>
        <p className={`text-[13px] mt-0.5 line-clamp-1 ${!notification.isRead ? "font-semibold text-gray-600" : "font-normal text-gray-400"}`}>
          {notification.content}
        </p>
      </div>
      <RelativeTime createdAt={notification.createdAt} />
    </div>
  );
}
