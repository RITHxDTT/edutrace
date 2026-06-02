"use client";

import { useState, useEffect, useCallback } from "react";
import { useKnockClient } from "@knocklabs/react";
import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";
import firebaseConfig from "@/config/firebase-config.json";

export function usePushNotification() {
  const knock = useKnockClient();
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermission(Notification.permission);
    }
  }, []);

  const [isSubscribing, setIsSubscribing] = useState(false);

  const pushChannelId = process.env.NEXT_PUBLIC_KNOCK_PUSH_CHANNEL_ID || "";
  const vapidKey =
    firebaseConfig.vapidKey ||
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    "";

  /**
   * Registers an FCM token with Knock's channel data.
   */
  const registerFcmToken = useCallback(async (fcmToken: string): Promise<boolean> => {
    if (!knock || !pushChannelId) {
      return false;
    }

    try {
      await knock.user.setChannelData({
        channelId: pushChannelId,
        channelData: {
          tokens: [fcmToken],
        },
      });
      return true;
    } catch (error) {
      console.error("[DEBUG] :  Error registering FCM token with Knock:", error);
      return false;
    }
  }, [knock, pushChannelId]);

  useEffect(() => {
    const autoFetchToken = async () => {
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted" &&
        messaging &&
        vapidKey
      ) {
        try {
          const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
          });

          if (token) {
            await registerFcmToken(token);
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes("Registration failed")) {
            console.warn(error.message);
          }
        }
      }
    };

    autoFetchToken();
  }, [vapidKey, registerFcmToken]);

  /**
   * retrieves the FCM registration token, and saves it in the Knock user channel data.
   */
  const requestPermissionAndSubscribe = async (): Promise<boolean> => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      console.warn("Push notifications are not supported in this browser.");
      return false;
    }

    try {
      setIsSubscribing(true);
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        console.warn("Notification permission was denied.");
        setIsSubscribing(false);
        return false;
      }

      if (!messaging) {
        console.warn("Firebase Messaging is not initialized.");
        setIsSubscribing(false);
        return false;
      }

      if (!vapidKey) {
        console.warn("VAPID Key not found in configuration.");
        setIsSubscribing(false);
        return false;
      }

      // Register the FCM service worker registration explicitly
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      // Fetch the FCM token from Firebase client
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        console.warn("No FCM token returned from Firebase.");
        setIsSubscribing(false);
        return false;
      }

      // Register the FCM token with the user profile in Knock
      const success = await registerFcmToken(token);
      setIsSubscribing(false);
      return success;
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      if (error instanceof Error && error.message.includes("Registration failed")) {
        console.warn(error.message);
      }
      setIsSubscribing(false);
      return false;
    }
  };

  return {
    permission,
    isSubscribing,
    requestPermissionAndSubscribe,
    registerFcmToken,
  };
}
