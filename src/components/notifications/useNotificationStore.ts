import { create } from "zustand";
import { mockNotifications } from "@/components/notifications/notification.mock";
import { Notification } from "@/components/notifications/notification.types";

interface NotificationStore {
  notifications: Notification[];

  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>(
  (set, get) => ({
    notifications: mockNotifications,

    markAllAsRead: () =>
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
        })),
      })),

    getUnreadCount: () =>
      get().notifications.filter((n) => !n.isRead).length,
  }),
);