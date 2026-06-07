"use client";

import { usePushNotification } from "@/components/notifications/usePushNotification";

export default function PushNotificationInitializer() {
  usePushNotification();

  return null;
}
