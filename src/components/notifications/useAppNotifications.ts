"use client";

import { useEffect } from "react";
import { useKnockFeed } from "@knocklabs/react";
import { mapKnockItemToNotification, MappedNotification } from "./notification.utils";

export function useAppNotifications() {
  const { feedClient, useFeedStore } = useKnockFeed();

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

  // Map to local UI schema
  const notifications: MappedNotification[] = knockItems.map(mapKnockItemToNotification);
  const unreadCount = knockMetadata.unread_count || 0;

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
