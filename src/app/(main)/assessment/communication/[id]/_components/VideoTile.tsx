"use client";

import { useEffect, useRef, useState } from "react";

interface VideoTileProps {
  stream: MediaStream | null;
  userName: string;
  muted?: boolean;
  small?: boolean;
  isMicMuted?: boolean;
  isCamOff?: boolean;
  isHandRaised?: boolean;
  isScreenShare?: boolean;
  profileImageUrl?: string | undefined;
}

function hasLiveVideoTrack(stream: MediaStream | null) {
  return (
    stream?.getVideoTracks().some((track) => {
      return track.readyState === "live" && track.enabled;
    }) ?? false
  );
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
  const [, refreshTrackState] = useState(0);

  useEffect(() => {
    if (!stream) {
      return;
    }

    const videoTracks = stream.getVideoTracks();
    const cleanups: (() => void)[] = [];
    const refresh = () => refreshTrackState((value) => value + 1);

    videoTracks.forEach((track) => {
      track.addEventListener("mute", refresh);
      track.addEventListener("unmute", refresh);
      track.addEventListener("ended", refresh);
      cleanups.push(() => {
        track.removeEventListener("mute", refresh);
        track.removeEventListener("unmute", refresh);
        track.removeEventListener("ended", refresh);
      });
    });

    stream.addEventListener("addtrack", refresh);
    stream.addEventListener("removetrack", refresh);

    return () => {
      cleanups.forEach((fn) => fn());
      stream.removeEventListener("addtrack", refresh);
      stream.removeEventListener("removetrack", refresh);
    };
  }, [stream]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream) {
      video.srcObject = stream;
      video.play().catch((err) => {
        if (err.name === "NotAllowedError") {
          video.muted = true;
          video.play().catch(() => {});
        }
      });
    } else {
      video.srcObject = null;
    }
  }, [stream]);

  const showAvatar = !hasLiveVideoTrack(stream) || (!isScreenShare && isCamOff);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#16161f] ${
        small ? "h-28 w-full flex-shrink-0" : "h-full w-full"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`h-full w-full scale-x-[-1] ${isScreenShare ? "object-contain" : "object-cover"} ${showAvatar ? "invisible" : ""}`}
      />

      {showAvatar && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#241cab] to-[#5d53f9]">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={userName}
              className={`rounded-full object-cover border-2 border-white/30 ${small ? "h-10 w-10" : "h-16 w-16"}`}
            />
          ) : (
            <div
              className={`flex items-center justify-center rounded-full bg-white/20 font-semibold text-white ${
                small ? "h-10 w-10 text-lg" : "h-16 w-16 text-2xl"
              }`}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          )}  
          <span
            className={`font-medium text-white/80 ${small ? "text-[10px]" : "text-xs"}`}
          >
            {userName}
          </span>
        </div>
      )}

      {isHandRaised && (
        <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-lg shadow-lg">
{"✋"}
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

      {!showAvatar && (
        <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          {userName}
        </div>
      )}
    </div>
  );
}
