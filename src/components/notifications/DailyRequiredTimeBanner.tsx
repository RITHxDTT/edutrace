"use client";

import { useDailyRequiredStore } from "@/stores/useDailyRequiredStore";
import { Clock } from "iconsax-react";
import Link from "next/link";

function BannerContent() {
  const { assessments } = useDailyRequiredStore();

  if (assessments.length === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-amber-50 px-4 py-2.5 border-b border-amber-200">
      <div className="flex shrink-0 items-center gap-1.5 text-amber-700">
        <Clock size={16} variant="Bold" />
        <span className="text-xs font-semibold whitespace-nowrap">
          Daily time required:
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
        {assessments.map((a) => (
          <Link
            key={a.assessmentId}
            href={`/assessment/${a.assessmentId}`}
            className="inline-flex items-center rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-200 active:bg-amber-300 whitespace-nowrap"
          >
            {a.title}
          </Link>
        ))}
      </div>

      <span className="shrink-0 text-[10px] text-amber-500 hidden sm:block">
        Complete your daily learning time to dismiss
      </span>
    </div>
  );
}

export default function DailyRequiredTimeBanner() {
  const { assessments } = useDailyRequiredStore();

  if (assessments.length === 0) return null;

  return (
    <>
      {/* Desktop: in-flow between navbar and main content */}
      <div className="hidden md:block">
        <BannerContent />
      </div>

      {/* Mobile: fixed at the bottom of the viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <BannerContent />
      </div>
    </>
  );
}
