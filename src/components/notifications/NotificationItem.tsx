"use client";

import { AtSign, Bell, CheckCircle, Clock, Upload, Video } from "lucide-react";
import { ClipboardText } from "iconsax-react";
import { MappedNotification, resolveNotificationPath } from "@/components/notifications/notification.utils";
import { Notification } from "@/components/notifications/notification.types";
import RelativeTime from "./RelativeTime";

interface NotificationItemProps {
  notification: MappedNotification;
  // Parent (NotificationDropdown) owns navigation — item just reports the click
  onClick: (notification: MappedNotification) => void;
}

type IconConfig = {
  icon: React.ElementType;
  bg: string;
  color: string;
};

const TYPE_ICON_MAP: Record<Notification["type"], IconConfig> = {
  ASSESSMENT_ASSIGNED: { icon: ClipboardText, bg: "bg-accent-lavender", color: "#5D53F9" },
  ASSESSMENT_DUE:      { icon: Clock,          bg: "bg-accent-sand",     color: "#DEA20A" },
  SUBMISSION_GRADED:   { icon: CheckCircle,    bg: "bg-[#E8F8F4]",       color: "#10B981" },
  MEETING_STARTED:     { icon: Video,          bg: "bg-accent-ice",      color: "#35b9ec" },
  MENTION:             { icon: AtSign,         bg: "bg-[#FFF0F0]",       color: "#e62020" },
  SUBMISSION_RECEIVED: { icon: Upload,         bg: "bg-accent-sand",     color: "#DEA20A" },
};

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const hasLink = !!resolveNotificationPath(notification);
  const stateClasses = notification.isRead
    ? "bg-white hover:bg-gray-50/80"
    : "bg-[#F8F7FF] hover:bg-[#F0EDFF]";

  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={`group flex w-full items-start gap-3 rounded-[18px] px-4 py-3 text-left ring-1 ring-gray-100 transition-colors sm:gap-4 sm:px-5 sm:py-4 ${stateClasses}
        ${hasLink ? "cursor-pointer" : "cursor-default"}`}
      aria-label={hasLink ? `Open notification: ${notification.title}` : notification.title}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 transition-transform group-hover:scale-[1.02] sm:h-12 sm:w-12 ${
          notification.isRead
            ? `${(TYPE_ICON_MAP[notification.type] ?? { bg: "bg-[#E8F8F4]" }).bg} ring-gray-100`
            : "bg-white ring-[#DED9FF]"
        }`}
      >
        {(() => {
          const { icon: Icon, color } = TYPE_ICON_MAP[notification.type] ?? {
            icon: Bell,
            color: "#10B981",
          };
          return <Icon className="h-5 w-5" size={20} color={color} strokeWidth={2.5} />;
        })()}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex min-w-0 items-start gap-2">
          {!notification.isRead && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#5D53F9]" />
          )}
          <h3
            className={`line-clamp-2 text-[14px] leading-snug sm:text-[15px] ${
              !notification.isRead
                ? "font-bold text-[#111827]"
                : "font-semibold text-[#4B5563]"
            }`}
          >
            {notification.title}
          </h3>
        </div>
        <p
          className={`mt-0.5 line-clamp-2 text-[12px] sm:text-[13px] ${
            !notification.isRead
              ? "font-medium text-[#4B5563]"
              : "font-normal text-[#9CA3AF]"
          }`}
        >
          {notification.content}
        </p>
      </div>

      <div className="shrink-0 pt-0.5">
        <RelativeTime createdAt={notification.createdAt} isRead={notification.isRead} />
      </div>
    </button>
  );
}
