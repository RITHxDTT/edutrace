"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface PreJoinLobbyProps {
  userName: string;
  profileImageUrl?: string;
  onJoin: (camOn: boolean, micOn: boolean) => void;
}

export default function PreJoinLobby({
  userName,
  profileImageUrl,
  onJoin,
}: PreJoinLobbyProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camAvailable, setCamAvailable] = useState(false);
  const [micAvailable, setMicAvailable] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function setup() {
      const combined = new MediaStream();

      try {
        const video = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!active) {
          video.getTracks().forEach((t) => t.stop());
          return;
        }
        video.getVideoTracks().forEach((t) => combined.addTrack(t));
        setCamAvailable(true);
      } catch {
        setCamOn(false);
      }

      try {
        const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!active) {
          audio.getTracks().forEach((t) => t.stop());
          return;
        }
        audio.getAudioTracks().forEach((t) => combined.addTrack(t));
        setMicAvailable(true);
      } catch {
        setMicOn(false);
      }

      if (!active) {
        combined.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = combined;
      if (videoRef.current) videoRef.current.srcObject = combined;
      setChecking(false);
    }

    setup();

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  function toggleCam() {
    if (!camAvailable) return;
    const next = !camOn;
    setCamOn(next);
    streamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = next;
    });
  }

  function toggleMic() {
    if (!micAvailable) return;
    const next = !micOn;
    setMicOn(next);
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = next;
    });
  }

  function handleJoin() {
    // Stop preview — useWebRTC will request fresh tracks after join
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    onJoin(camOn && camAvailable, micOn && micAvailable);
  }

  const showVideo = camOn && camAvailable && !checking;

  const statusText = checking
    ? "Checking your devices…"
    : !camAvailable && !micAvailable
      ? "No camera or microphone found — you can still join"
      : !camAvailable
        ? "No camera found — you'll join with audio only"
        : !micAvailable
          ? "No microphone found — you'll join with video only"
          : `Camera ${camOn ? "on" : "off"} · Microphone ${micOn ? "on" : "off"}`;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-7 bg-[#0c0c14] p-6">
      {/* Camera preview */}
      <div className="relative w-full max-w-[380px] aspect-video rounded-2xl overflow-hidden bg-[#16161f] shadow-2xl ring-1 ring-white/10">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`h-full w-full object-cover scale-x-[-1] ${showVideo ? "" : "hidden"}`}
        />

        {!showVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#241cab] to-[#5d53f9]">
            {checking ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={userName}
                className="h-20 w-20 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            {!checking && (
              <span className="text-sm font-medium text-white/80">{userName}</span>
            )}
          </div>
        )}

        {showVideo && (
          <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
            {userName}
          </div>
        )}
      </div>

      {/* Device toggles */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={toggleMic}
            disabled={!micAvailable}
            title={micOn ? "Mute microphone" : "Unmute microphone"}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              !micAvailable
                ? "cursor-not-allowed bg-white/5 text-white/20"
                : micOn
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-red-500/80 text-white hover:bg-red-500"
            }`}
          >
            {micOn && micAvailable ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <span className="text-[11px] text-white/40">
            {micOn && micAvailable ? "Mic on" : "Mic off"}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={toggleCam}
            disabled={!camAvailable}
            title={camOn ? "Turn off camera" : "Turn on camera"}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              !camAvailable
                ? "cursor-not-allowed bg-white/5 text-white/20"
                : camOn
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-red-500/80 text-white hover:bg-red-500"
            }`}
          >
            {camOn && camAvailable ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <span className="text-[11px] text-white/40">
            {camOn && camAvailable ? "Cam on" : "Cam off"}
          </span>
        </div>
      </div>

      {/* Device status */}
      <p className="text-center text-sm text-white/40">{statusText}</p>

      {/* Join button */}
      <button
        onClick={handleJoin}
        disabled={checking}
        style={{
          background: "linear-gradient(to bottom, #241cab 37%, #5d53f9 82%)",
        }}
        className="rounded-xl px-10 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Join Now
      </button>
    </div>
  );
}
