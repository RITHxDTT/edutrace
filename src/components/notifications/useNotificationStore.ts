import { create } from "zustand";
import { Notification } from "./notification.types";

interface NotificationStore {
  notifications: Notification[];

  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>(
  (set, get) => ({
    notifications: [],

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