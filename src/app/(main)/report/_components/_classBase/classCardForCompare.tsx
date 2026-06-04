"use client";

import { useState } from "react";

type ClassSubmissionCardProps = {
  className: string;
  submitted: number;
  lateSubmission: number;
  total: number;
};

type TooltipState = {
  visible: boolean;
  label: string;
  value: number;
  x: number;
};

export default function ClassSubmissionCard({
  className,
  submitted,
  lateSubmission,
  total,
}: ClassSubmissionCardProps) {
  const onTime = submitted - lateSubmission;
  const onTimeWidth = total === 0 ? 0 : (onTime / total) * 100;
  const lateWidth = total === 0 ? 0 : (lateSubmission / total) * 100;
  const missing = total - submitted;

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    label: "",
    value: 0,
    x: 0,
  });

  const showTooltip = (
    label: string,
    value: number,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement!.getBoundingClientRect();
    setTooltip({
      visible: true,
      label,
      value,
      x: rect.left - parentRect.left + rect.width / 2,
    });
  };

  const hideTooltip = () => setTooltip((t) => ({ ...t, visible: false }));

  return (
    <div className="w-full h-auto rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-slate-800">{className}</h3>
      <div className="mt-2 h-px w-full bg-slate-100" />
      <div className="mt-4 flex items-end gap-1">
        <span className="text-4xl font-bold leading-none text-slate-900">
          {submitted}
        </span>
        <span className="mb-0.5 text-lg font-semibold text-slate-700">
          /{total}
        </span>
        <span className="mb-0.5 text-md font-semibold text-emerald-500">
          submitted
        </span>
      </div>
      <div className="relative mt-4 flex h-4 w-full gap-1.5">
        {tooltip.visible && (
          <div
            className="absolute -top-8 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white pointer-events-none"
            style={{ left: tooltip.x }}
          >
            {tooltip.label}: {tooltip.value}
          </div>
        )}
        <div
          className="h-full cursor-pointer rounded-md bg-purple transition-opacity hover:opacity-80"
          style={{ width: `${onTimeWidth}%` }}
          onMouseEnter={(e) => showTooltip("On-Time", onTime, e)}
          onMouseLeave={hideTooltip}
        />
        <div
          className="h-full cursor-pointer rounded-md bg-accent-purple transition-opacity hover:opacity-80"
          style={{ width: `${lateWidth}%` }}
          onMouseEnter={(e) => showTooltip("Late", lateSubmission, e)}
          onMouseLeave={hideTooltip}
        />
        <div
          className="h-full flex-1 cursor-pointer rounded-md bg-light-purple transition-opacity hover:opacity-80"
          onMouseEnter={(e) => showTooltip("Missing", missing, e)}
          onMouseLeave={hideTooltip}
        />
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-purple" />
          <span className="text-xs text-slate-600">On-Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-purple" />
          <span className="text-xs text-slate-600">Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-light-purple" />
          <span className="text-xs text-slate-600">Missing</span>
        </div>
      </div>
    </div>
  );
}
