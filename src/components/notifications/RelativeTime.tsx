"use client";

import { useSyncExternalStore } from "react";
import { parseAbsoluteToLocal } from "@internationalized/date";

const timeStore = {
  subscribe(cb: () => void) {
    const interval = setInterval(() => {
      cb();
    }, 60000); 
    return () => clearInterval(interval);
  },
  getSnapshot() {
    return Date.now(); 
  },
  getServerSnapshot() {
    return null;
  }
};

export default function RelativeTime({ createdAt }: { createdAt: string }) {
  const now = useSyncExternalStore(timeStore.subscribe, timeStore.getSnapshot, timeStore.getServerSnapshot);

  if (!now) return <span className="text-[13px] font-medium text-gray-400">...</span>;

  let created: number;
  try {
    created = parseAbsoluteToLocal(createdAt).toDate().getTime();
  } catch (e) {
    const d = new Date(createdAt);
    created = d.getTime();
  }

  if (isNaN(created)) {
    return <div className="text-[13px] font-medium text-disabled whitespace-nowrap pl-2 pt-1 self-start">Invalid date</div>;
  }

  const diffInMs = created - now;
  const diffInSeconds = Math.trunc(diffInMs / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  if (absSeconds < 60) {
    return (
      <div className="text-[13px] font-medium text-disabled whitespace-nowrap pl-2 pt-1 self-start">
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
      <div className="text-[13px] font-medium text-disabled whitespace-nowrap pl-2 pt-1 self-start">
        {rtf.format(diffInMinutes, "minute")}
      </div>
    );
  }

  const diffInHours = Math.trunc(diffInMinutes / 60);
  const absHours = Math.abs(diffInHours);
  if (absHours < 24) {
    return (
      <div className="text-[13px] font-medium text-disabled whitespace-nowrap pl-2 pt-1 self-start">
        {rtf.format(diffInHours, "hour")}
      </div>
    );
  }

  const diffInDays = Math.trunc(diffInHours / 24);
  const absDays = Math.abs(diffInDays);
  if (absDays < 7) {
    return (
      <div className="text-[13px] font-medium text-disabled whitespace-nowrap pl-2 pt-1 self-start">
        {rtf.format(diffInDays, "day")}
      </div>
    );
  }

  const diffInWeeks = Math.trunc(diffInDays / 7);
  return (
    <div className="text-[13px] font-medium text-disabled whitespace-nowrap pl-2 pt-1 self-start">
      {rtf.format(diffInWeeks, "week")}
    </div>
  );
}
