"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllAssessmentAction, getAllMyAssessmentAction } from "@/actions/assessment.action";
import { useAppNotifications } from "@/components/notifications/useAppNotifications";
import { useSession } from "next-auth/react";
import { AssessmentType } from "@/types/assessment";
import NotificationItem from "./NotificationItem";
import { MappedNotification, resolveNotificationPath } from "./notification.utils";

interface NotificationDropdownProps {
  onClose?: () => void;
}

type AssessmentResult =
  | AssessmentType[]
  | { content?: AssessmentType[] }
  | { error?: string }
  | undefined;

function normalizeAssessments(result: AssessmentResult): AssessmentType[] {
  if (!result || ("error" in result && result.error)) return [];
  if (Array.isArray(result)) return result;
  if ("content" in result) return result.content ?? [];
  return [];
}

function normalizeMatchText(value?: string) {
  return value?.toLowerCase().replace(/\s+/g, " ").trim() ?? "";
}

function findAssessmentPath(
  assessments: AssessmentType[],
  notification: MappedNotification,
) {
  const title = normalizeMatchText(notification.assessmentTitle);
  const content = normalizeMatchText(`${notification.title} ${notification.content}`);

  const assessment = assessments.find((item) => {
    const itemTitle = normalizeMatchText(item.title);
    return (
      (!!title && (itemTitle === title || itemTitle.includes(title) || title.includes(itemTitle))) ||
      (!!content && content.includes(itemTitle))
    );
  });

  return assessment ? `/assessment/${assessment.assessmentId}` : null;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const router = useRouter();
  const { data: session } = useSession();

  const { notifications, unreadCount, markAllAsRead, markAsRead } =
    useAppNotifications();

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") return notifications.filter((n) => !n.isRead);
    return notifications;
  }, [activeTab, notifications]);

  const handleItemClick = async (notification: MappedNotification) => {
    // 1. Mark as read
    markAsRead(notification);

    // 2. Resolve the destination path
    let path = resolveNotificationPath(notification);

    if (path === "/assessment" || path?.startsWith("/assessment?")) {
      const result =
        session?.user?.role === "teacher"
          ? await getAllAssessmentAction({ page: 1, size: 100 })
          : await getAllMyAssessmentAction({ page: 1, size: 100 });
      path = findAssessmentPath(normalizeAssessments(result), notification) ?? path;
    }

    if (!path) return;
    onClose?.();
    setTimeout(() => router.push(path), 0);
  };

  return (
    <div className="bg-white pb-3 font-sans text-gray-950 sm:pb-4">
      <div className="px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
        <h2 className="mb-4 text-[22px] font-medium tracking-tight text-gray-950 sm:text-[26px]">
          All Notifications
        </h2>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 rounded-full bg-[#EEF2F7] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`min-w-14 cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52c7ee] sm:min-w-20 sm:text-base ${
                activeTab === "all"
                  ? "bg-[#5D53F9] text-white"
                  : "text-[#7B8794] hover:text-[#5D53F9]"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("unread")}
              className={`min-w-24 cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52c7ee] sm:min-w-28 sm:text-base ${
                activeTab === "unread"
                  ? "bg-[#5D53F9] text-white"
                  : "text-[#7B8794] hover:text-[#5D53F9]"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <button
            onClick={markAllAsRead}
            className="shrink-0 cursor-pointer text-right text-xs font-bold text-[#5D53F9] transition-colors hover:text-[#241CAB] sm:text-sm"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="max-h-[min(440px,calc(100vh-180px))] space-y-3 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6">
        {filteredNotifications.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#9aa3b2]">
            No notifications
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <NotificationItem
              key={n.notificationId}
              notification={n}
              onClick={handleItemClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
