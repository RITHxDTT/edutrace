"use client";

import { useEffect, useRef } from "react";
import { useKnockFeed } from "@knocklabs/react";
import { useSession } from "next-auth/react";
import { sileo } from "sileo";
import { isScheduledAssessmentNotification, mapKnockItemToNotification } from "./notification.utils";

export default function NotificationListener() {
  const { feedClient } = useKnockFeed();
  const { data: session } = useSession();
  const isStudent = session?.user?.role === "student";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUnlockedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio("/audios/soundeffects/notification-soundeffect.mp3");
    audio.volume = 0.6;
    audioRef.current = audio;
    return () => { audio.pause(); };
  }, []);

  // Unlock audio context on first user interaction
  useEffect(() => {
    const unlock = () => {
      const audio = audioRef.current;
      if (!audio || isUnlockedRef.current) return;
      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          isUnlockedRef.current = true;
          window.removeEventListener("click", unlock);
          window.removeEventListener("keydown", unlock);
        })
        .catch(() => {});
    };

    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (!feedClient) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRealtime = ({ items }: { items: any[] }) => {
      if (!items?.length) return;

      // Students don't see toasts for assessments that haven't started yet
      const visibleItems = isStudent
        ? items.filter(
            (item) => !isScheduledAssessmentNotification(mapKnockItemToNotification(item)),
          )
        : items;

      if (!visibleItems.length) return;

      const audio = audioRef.current;
      if (audio && isUnlockedRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }

      visibleItems.forEach((item) => {
        const notification = mapKnockItemToNotification(item);
        sileo.info({
          title: notification.title,
          description: notification.content || undefined,
        });
      });
    };

    feedClient.on("items.received.realtime", handleRealtime);
    return () => {
      feedClient.off("items.received.realtime", handleRealtime);
    };
  }, [feedClient]);

  return null;
}
