"use client";

import { useSyncExternalStore } from "react";
import { parseAbsoluteToLocal } from "@internationalized/date";

let currentTimeSnapshot = Date.now();

const timeStore = {
  subscribe(cb: () => void) {
    const interval = setInterval(() => {
      currentTimeSnapshot = Date.now();
      cb();
    }, 60000); 
    return () => clearInterval(interval);
  },
  getSnapshot() {
    return currentTimeSnapshot; 
  },
  getServerSnapshot() {
    return null;
  }
};

type RelativeTimeProps = {
  createdAt: string;
  isRead?: boolean;
};

function timeClassName(isRead?: boolean) {
  return `whitespace-nowrap text-[11px] font-medium sm:text-[13px] ${
    isRead ? "text-[#9CA3AF]" : "text-[#5D53F9]"
  }`;
}

export default function RelativeTime({ createdAt, isRead }: RelativeTimeProps) {
  const now = useSyncExternalStore(timeStore.subscribe, timeStore.getSnapshot, timeStore.getServerSnapshot);
  const className = timeClassName(isRead);

  if (!now) return <span className={className}>...</span>;

  let created: number;
  try {
    created = parseAbsoluteToLocal(createdAt).toDate().getTime();
  } catch {
    const d = new Date(createdAt);
    created = d.getTime();
  }

  if (isNaN(created)) {
    return <div className={className}>Invalid date</div>;
  }

  const diffInMs = created - now;
  const diffInSeconds = Math.trunc(diffInMs / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  if (absSeconds < 60) {
    return (
      <div className={className}>
        just now
      </div>
    );
  }

  const rtf = new Intl.RelativeTimeFormat("en", {
    style: "short",
    numeric: "always",
  });

  const diffInMinutes = Math.trunc(diffInSeconds / 60);
  const absMinutes = Math.abs(diffInMinutes);
  if (absMinutes < 60) {
    return (
      <div className={className}>
        {rtf.format(diffInMinutes, "minute")}
      </div>
    );
  }

  const diffInHours = Math.trunc(diffInMinutes / 60);
  const absHours = Math.abs(diffInHours);
  if (absHours < 24) {
    return (
      <div className={className}>
        {rtf.format(diffInHours, "hour")}
      </div>
    );
  }

  const diffInDays = Math.trunc(diffInHours / 24);
  const absDays = Math.abs(diffInDays);
  if (absDays < 7) {
    return (
      <div className={className}>
        {rtf.format(diffInDays, "day")}
      </div>
    );
  }

  const diffInWeeks = Math.trunc(diffInDays / 7);
  return (
    <div className={className}>
      {rtf.format(diffInWeeks, "week")}
    </div>
  );
}
