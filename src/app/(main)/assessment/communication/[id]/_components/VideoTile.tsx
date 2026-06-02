"use client";

import { useEffect, useRef } from "react";

interface VideoTileProps {
  stream: MediaStream | null;
  userName: string;
  muted?: boolean;
  small?: boolean;
  isMicMuted?: boolean;
  isCamOff?: boolean;
  isHandRaised?: boolean;
  isScreenShare?: boolean;
  profileImageUrl?: string;
}

export default function VideoTile({
  stream,
  userName,
  muted = false,
  small = false,
  isMicMuted = false,
  isCamOff = false,
  isHandRaised = false,
  isScreenShare = false,
  profileImageUrl,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const showAvatar = !stream || isCamOff;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#2a2a4a] ${
        small
          ? "h-28 w-full flex-shrink-0"
          : isScreenShare
            ? "h-full w-full"
            : "aspect-video w-full"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`h-full w-full ${isScreenShare ? "object-contain" : "object-cover"} ${showAvatar ? "hidden" : ""}`}
      />

      {showAvatar && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#241cab] to-[#5d53f9]">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={userName}
              className="h-16 w-16 rounded-full object-cover border-2 border-white/30"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {isHandRaised && (
        <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-lg shadow-lg">
          ✋
        </div>
      )}

      {isMicMuted && (
        <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80">
          <svg
            className="h-3.5 w-3.5 text-white"
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

      <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
        {userName}
      </div>
    </div>
  );
}
