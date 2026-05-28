import React from "react";

interface FolderCardProps {
  avatarUrl?: string;
  studentName?: string;
  status?: "Handed In" | "Pending" | "Late";
  fileName?: string;
  date?: string;
  time?: string;
  fileSize?: string;
}

const STATUS_CONFIG = {
  "Handed In": {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-500",
    dot: "bg-amber-400",
  },
  Late: {
    bg: "bg-red-50",
    text: "text-red-500",
    dot: "bg-red-400",
  },
} as const;

export default function FolderCard({
  avatarUrl,
  studentName = "Chhorn Chamreun",
  status = "Handed In",
  fileName = "16_CHHORN_CHAMREUN_ASSIGNMENT.pdf",
  date = "13 May 2026",
  time = "11:00 PM",
  fileSize = "42 MB",
}: FolderCardProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="w-full pt-6">
      <div className="relative rounded-2xl border border-slate-200 bg-white px-4 pb-4 pt-8 shadow-sm transition hover:shadow-md sm:px-5 sm:pb-5 sm:pt-9">
        
        {/* Watermark */}
        <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.04]">
          <WatermarkIcon />
        </div>

        {/* Avatar */}
        <div className="absolute -top-5 left-4 h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-md">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={studentName}
              className="h-full w-full object-cover"
            />
          ) : (
            <DefaultAvatar />
          )}
        </div>

        {/* Header */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Name */}
          <h3 className="max-w-full truncate pr-2 text-sm font-semibold text-slate-900 sm:max-w-[180px]">
            {studentName}
          </h3>

          {/* Status */}
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
            />

            {status}
          </span>
        </div>

        {/* Divider */}
        <div className="mb-4 h-px bg-slate-100" />

        {/* File */}
        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            File
          </p>

          <p
            title={fileName}
            className="truncate text-sm font-bold text-slate-900 sm:text-base"
          >
            {fileName}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
          <MetaItem icon={<CalendarIcon />} label={date} />
          <MetaItem icon={<ClockIcon />} label={time} />
          <MetaItem icon={<FileIcon />} label={fileSize} />
        </div>
      </div>
    </div>
  );
}

function MetaItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1 text-center">
      {icon}

      <span className="truncate text-[10px] font-medium text-slate-400 sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

function DefaultAvatar() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <rect width="44" height="44" fill="#cbd5e1" />
      <circle cx="22" cy="17" r="8" fill="#94a3b8" />
      <ellipse cx="22" cy="36" rx="14" ry="9" fill="#94a3b8" />
    </svg>
  );
}

function WatermarkIcon() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-black"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}