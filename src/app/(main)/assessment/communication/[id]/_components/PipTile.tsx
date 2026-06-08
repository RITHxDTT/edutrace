"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Mic, MicOff, ScreenShare, Video, VideoOff, X } from "lucide-react";

interface PipTileProps {
  stream: MediaStream | null;
  userName: string;
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenShare?: boolean;
  profileImageUrl?: string;
  onClose: () => void;
  // Action callbacks — only passed for the local camera stream
  onToggleMic?: () => void;
  onToggleCam?: () => void;
  onToggleScreen?: () => void;
  isScreenSharing?: boolean;
}

function hasLiveVideoTrack(stream: MediaStream | null) {
  return (
    stream?.getVideoTracks().some((t) => t.readyState === "live" && t.enabled) ??
    false
  );
}

export default function PipTile({
  stream,
  userName,
  isMicOn,
  isCamOn,
  isScreenShare = false,
  profileImageUrl,
  onClose,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  isScreenSharing = false,
}: PipTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const [, refresh] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPos({ x: window.innerWidth - 220, y: window.innerHeight - 200 });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream ?? null;
    if (stream) video.play().catch(() => {});
  }, [stream]);

  useEffect(() => {
    if (!stream) return;
    const r = () => refresh((v) => v + 1);
    const tracks = stream.getVideoTracks();
    tracks.forEach((t) => {
      t.addEventListener("mute", r);
      t.addEventListener("unmute", r);
      t.addEventListener("ended", r);
    });
    stream.addEventListener("addtrack", r);
    stream.addEventListener("removetrack", r);
    return () => {
      tracks.forEach((t) => {
        t.removeEventListener("mute", r);
        t.removeEventListener("unmute", r);
        t.removeEventListener("ended", r);
      });
      stream.removeEventListener("addtrack", r);
      stream.removeEventListener("removetrack", r);
    };
  }, [stream]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const tile = tileRef.current;
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    dragging.current = true;
    startPos.current = { x: rect.left, y: rect.top };
    startPointer.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const tile = tileRef.current;
    const W = tile?.offsetWidth ?? 192;
    const H = tile?.offsetHeight ?? 144;
    setPos({
      x: Math.max(
        0,
        Math.min(
          window.innerWidth - W,
          startPos.current.x + (e.clientX - startPointer.current.x),
        ),
      ),
      y: Math.max(
        0,
        Math.min(
          window.innerHeight - H,
          startPos.current.y + (e.clientY - startPointer.current.y),
        ),
      ),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const style: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y }
    : { left: -9999, top: -9999, visibility: "hidden" };

  const showAvatar = isScreenShare
    ? !hasLiveVideoTrack(stream)
    : !hasLiveVideoTrack(stream) || !isCamOn;

  const hasActions = !isScreenShare && (onToggleMic || onToggleCam || onToggleScreen);

  return createPortal(
    <div
      ref={tileRef}
      style={style}
      className="group fixed z-[9999] h-36 w-48 cursor-grab select-none overflow-hidden rounded-xl border border-white/20 shadow-2xl active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
      >
        <X size={11} />
      </button>

      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`h-full w-full ${isScreenShare ? "object-contain" : "scale-x-[-1] object-cover"} ${showAvatar ? "invisible" : ""}`}
      />

      {/* Avatar fallback */}
      {showAvatar && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#241cab] to-[#5d53f9]">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={userName}
              className="h-10 w-10 rounded-full border-2 border-white/30 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-[10px] font-medium text-white/80">{userName}</span>
        </div>
      )}

      {/* Name label — hidden when action bar is visible */}
      {!showAvatar && (
        <div
          className={`absolute left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white transition-all duration-200 ${
            hasActions
              ? "bottom-8 group-hover:opacity-0"
              : "bottom-1.5"
          }`}
        >
          {userName}
        </div>
      )}

      {/* Mic-muted indicator (only when action bar is absent or not hovered) */}
      {!isMicOn && !isScreenShare && !hasActions && (
        <div className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/80">
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v2a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
          </svg>
        </div>
      )}

      {/* Action bar — slides up on hover for local camera stream */}
      {hasActions && (
        <div className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-2 bg-black/60 py-1.5 backdrop-blur-sm transition-transform duration-200 group-hover:translate-y-0">
          {onToggleMic && (
            <button
              onClick={onToggleMic}
              title={isMicOn ? "Mute" : "Unmute"}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                isMicOn
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isMicOn ? <Mic size={13} /> : <MicOff size={13} />}
            </button>
          )}

          {onToggleCam && (
            <button
              onClick={onToggleCam}
              title={isCamOn ? "Turn off camera" : "Turn on camera"}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                isCamOn
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isCamOn ? <Video size={13} /> : <VideoOff size={13} />}
            </button>
          )}

          {onToggleScreen && (
            <button
              onClick={onToggleScreen}
              title={isScreenSharing ? "Stop sharing" : "Share screen"}
              style={
                isScreenSharing
                  ? {
                      background:
                        "linear-gradient(to bottom, #241cab 37%, #5d53f9 82%)",
                    }
                  : undefined
              }
              className={`flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors ${
                isScreenSharing ? "hover:opacity-90" : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <ScreenShare size={13} />
            </button>
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}
