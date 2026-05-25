import React from "react";

interface FolderCardProps {
  avatarUrl?: string;
  studentName?: string;
  status?: "Handed In" | "Pending" | "Late";
  fileName?: string;
  date?: string;
  time?: string;
  fileSize?: string;
  folderIconUrl?: string;
}

const statusConfig = {
  "Handed In": { bg: "#e6f9f0", color: "#1db866" },
  Pending: { bg: "#fff8e1", color: "#f59e0b" },
  Late: { bg: "#fde8e8", color: "#e53e3e" },
};

export default function FolderCard({
  avatarUrl,
  studentName = "Chhorn Chamreun",
  status = "Handed In",
  fileName = "16_CHHORN_CHAMREUN_ASSIGNMENT.pdf",
  date = "13 May 2026",
  time = "11:00 PM",
  fileSize = "42.MB",
  folderIconUrl,
}: FolderCardProps) {
  const { bg, color } = statusConfig[status] ?? statusConfig["Handed In"];
  const truncated =
    fileName.length > 18 ? fileName.slice(0, 18) + "..." : fileName;

  return (
    <div style={{ paddingTop: 22, display: "inline-block" }}>
      <div
        style={{
          fontFamily:
            "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
          background: "#fff",
          borderRadius: 18,
          padding: "28px 16px 14px",
          width: 314,
          boxShadow: "0 2px 20px rgba(0,0,0,0.10)",
          position: "relative",
          overflow: "hidden", // clips the ghost watermark
        }}
      >
        {/* ── Ghost watermark (folder icon, faint, behind everything) ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -18,
            right: -14,
            opacity: 0.08,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <GhostFolderIcon size={160} />
        </div>

        {/* ── All real content sits above the ghost (zIndex: 1) ── */}

        {/* Avatar — overlaps top edge */}
        <div
          style={{
            position: "absolute",
            top: -22,
            left: 16,
            width: 44,
            height: 44,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2.5px solid #fff",
            boxShadow: "0 1px 6px rgba(0,0,0,0.13)",
            background: "#c8d8f0",
            zIndex: 1,
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={studentName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="44" height="44" fill="#c8d8f0" />
              <circle cx="22" cy="17" r="8" fill="#7a9fc2" />
              <ellipse cx="22" cy="36" rx="14" ry="9" fill="#7a9fc2" />
            </svg>
          )}
        </div>

        {/* Top-right: badge + folder icon */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            zIndex: 1,
          }}
        >
          <span
            style={{
              background: bg,
              color,
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 9px",
              borderRadius: 20,
              whiteSpace: "nowrap",
            }}
          >
            {status}
          </span>
          {folderIconUrl ? (
            <img
              src={folderIconUrl}
              alt="folder"
              style={{ width: 50, height: 50, objectFit: "contain" }}
            />
          ) : (
            <FolderIcon />
          )}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 8,
            marginTop: 4,
            maxWidth: 160,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            position: "relative",
            zIndex: 1,
          }}
        >
          {studentName}
        </div>

        {/* File name */}
        <div
          title={fileName}
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#111",
            letterSpacing: -0.3,
            margin: "0 0 12px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            position: "relative",
            zIndex: 1,
          }}
        >
          {truncated}
        </div>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #f0f0f0",
            paddingTop: 10,
            position: "relative",
            zIndex: 1,
          }}
        >
          <MetaItem icon={<CalendarIcon />} label={date} />
          <Sep />
          <MetaItem icon={<ClockIcon />} label={time} />
          <Sep />
          <MetaItem icon={<FileIcon />} label={fileSize} />
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        flex: 1,
      }}
    >
      {icon}
      <span style={{ fontSize: 10, color: "#777", fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return <div style={{ width: 1, height: 30, background: "#f0f0f0" }} />;
}

/** The small dark folder icon shown top-right */
function FolderIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="44" height="44" rx="10" fill="#1a1a2e" />
      <path
        d="M10 18C10 16.34 11.34 15 13 15H19l2.5 2.5H31C32.66 17.5 34 18.84 34 20.5v11c0 1.66-1.34 3-3 3H13c-1.66 0-3-1.34-3-3V18z"
        fill="#2d2d4e"
      />
      <path
        d="M10 21C10 19.34 11.34 18 13 18H31c1.66 0 3 1.34 3 3v9.5c0 1.66-1.34 3-3 3H13c-1.66 0-3-1.34-3-3V21z"
        fill="#3a3a5c"
      />
      <line
        x1="17"
        y1="25"
        x2="27"
        y2="25"
        stroke="#7070a0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Large ghost folder used as a watermark behind card content */
function GhostFolderIcon({ size = 160 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="44" height="44" rx="10" fill="#1a1a2e" />
      <path
        d="M10 18C10 16.34 11.34 15 13 15H19l2.5 2.5H31C32.66 17.5 34 18.84 34 20.5v11c0 1.66-1.34 3-3 3H13c-1.66 0-3-1.34-3-3V18z"
        fill="#2d2d4e"
      />
      <path
        d="M10 21C10 19.34 11.34 18 13 18H31c1.66 0 3 1.34 3 3v9.5c0 1.66-1.34 3-3 3H13c-1.66 0-3-1.34-3-3V21z"
        fill="#3a3a5c"
      />
      <line
        x1="17"
        y1="25"
        x2="27"
        y2="25"
        stroke="#7070a0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#aab0bb"
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
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#aab0bb"
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
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#aab0bb"
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
