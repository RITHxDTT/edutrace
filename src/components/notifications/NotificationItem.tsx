"use client";

import { AtSign, Bell, CheckCircle, Clock, Upload, Video } from "lucide-react";
import { ClipboardText } from "iconsax-react";
import { MappedNotification, resolveNotificationPath } from "@/components/notifications/notification.utils";
import { Notification } from "@/components/notifications/notification.types";
import RelativeTime from "./RelativeTime";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: MappedNotification;
  onClick: (notification: MappedNotification) => void;
}

type IconConfig = {
  icon: React.ElementType;
  bg: string;
  color: string;
};

const TYPE_ICON_MAP: Record<Notification["type"], IconConfig> = {
  ASSESSMENT_ASSIGNED: { icon: ClipboardText, bg: "bg-accent-lavender", color: "#2E25C9" },
  ASSESSMENT_DUE: { icon: Clock, bg: "bg-accent-sand", color: "#DEA20A" },
  SUBMISSION_GRADED: { icon: CheckCircle, bg: "bg-[#E8F8F4]", color: "#10B981" },
  MEETING_STARTED: { icon: Video, bg: "bg-accent-ice", color: "#35b9ec" },
  MENTION: { icon: AtSign, bg: "bg-[#FFF0F0]", color: "#e62020" },
  SUBMISSION_RECEIVED: { icon: Upload, bg: "bg-accent-sand", color: "#DEA20A" },
};

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    onClick(notification);
    const path = resolveNotificationPath(notification);
    if (path) router.push(path);
  };

  const { icon: Icon, bg, color } = TYPE_ICON_MAP[notification.type] ?? {
    icon: Bell,
    bg: "bg-[#E8F8F4]",
    color: "#10B981",
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors cursor-pointer ${!notification.isRead ? "bg-slate-50/10 font-semibold" : "opacity-80"
        }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
        <Icon className="w-5 h-5" size={20} color={color} strokeWidth={2.5} />
      </div>

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
