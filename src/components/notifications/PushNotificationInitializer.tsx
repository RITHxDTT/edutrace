"use client";

import { usePushNotification } from "@/components/notifications/usePushNotification";

export default function PushNotificationInitializer() {
  // We just call the hook to ensure it initializes and handles permissions/tokens
  // in the background. It doesn't need to render anything in the navbar shell.
  usePushNotification();
  
  return null;
}
