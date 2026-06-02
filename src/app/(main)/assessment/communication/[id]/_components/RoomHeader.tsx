"use client";

import { useEffect, useState } from "react";
import { Copy, TickCircle } from "iconsax-react";

interface RoomHeaderProps {
  roomName: string;
  meetingRoomId: string;
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export default function RoomHeader({
  roomName,
  meetingRoomId,
}: RoomHeaderProps) {
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleCopy() {
    const link = `${window.location.origin}/assessment/communication/${meetingRoomId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a2e]/80 backdrop-blur border-b border-white/10">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-white truncate max-w-[300px]">
          {roomName}
        </h2>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70 font-mono">
          {formatElapsed(elapsed)}
        </span>
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition-colors"
      >
        {copied ? (
          <>
            <TickCircle size={14} />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
