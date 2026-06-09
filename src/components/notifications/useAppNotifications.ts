"use client";

import { useEffect } from "react";
import { useKnockFeed } from "@knocklabs/react";
import { useSession } from "next-auth/react";
import {
  isScheduledAssessmentNotification,
  mapKnockItemToNotification,
  MappedNotification,
} from "./notification.utils";

export function useAppNotifications() {
  const { feedClient, useFeedStore } = useKnockFeed();
  const { data: session } = useSession();
  const isStudent = session?.user?.role === "student";

  // Select from Knock store
  const knockItems = useFeedStore((state) => state.items);
  const knockMetadata = useFeedStore((state) => state.metadata);
  const knockLoading = useFeedStore((state) => state.loading);

  // Fetch feed on mount
  useEffect(() => {
    if (feedClient) {
      feedClient.fetch();
    }
  }, [feedClient]);

  // Map and filter: students don't see notifications for SCHEDULED (future) assessments
  const allNotifications: MappedNotification[] = knockItems.map(mapKnockItemToNotification);
  const notifications = isStudent
    ? allNotifications.filter((n) => !isScheduledAssessmentNotification(n))
    : allNotifications;
  const unreadCount = isStudent
    ? notifications.filter((n) => !n.isRead).length
    : knockMetadata.unread_count || 0;

  const markAllAsRead = () => {
    feedClient?.markAllAsRead();
  };

  const markAsRead = (notification: MappedNotification) => {
    if (notification._original) {
      feedClient?.markAsRead(notification._original);
    }
  };

  return {
    notifications,
    unreadCount,
    isFetching: knockLoading,
    markAllAsRead,
    markAsRead,
  };
}
