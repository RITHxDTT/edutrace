"use client";

import { useDailyRequiredStore } from "@/stores/useDailyRequiredStore";
import { Clock } from "iconsax-react";
import Link from "next/link";

function BannerContent() {
  const { assessments } = useDailyRequiredStore();

  if (assessments.length === 0) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-amber-50 px-3 sm:px-4 py-2.5 border-b border-amber-200 overflow-hidden">
      {/* Label — always visible */}
      <div className="flex shrink-0 items-center gap-1.5 text-amber-700">
        <Clock size={16} variant="Bold" />
        <span className="text-xs font-semibold whitespace-nowrap hidden sm:inline">
          Daily time required:
        </span>
        <span className="text-xs font-semibold whitespace-nowrap sm:hidden">
          Daily:
        </span>
      </div>

      {/* Scrollable chips row with fade on both edges */}
      <div className="relative flex-1 min-w-0">
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {assessments.map((a) => (
            <Link
              key={a.assessmentId}
              href={`/assessment/${a.assessmentId}`}
              className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-200 active:bg-amber-300 whitespace-nowrap"
            >
              {a.title}
            </Link>
          ))}
        </div>
        {/* Right fade to signal overflow */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-amber-50 to-transparent" />
      </div>

      {/* Count badge — visible when there are many */}
      {assessments.length > 2 && (
        <span className="shrink-0 rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700 whitespace-nowrap">
          {assessments.length}
        </span>
      )}

      <span className="shrink-0 text-[10px] text-amber-500 hidden lg:block whitespace-nowrap">
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
