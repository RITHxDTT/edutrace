"use client";

import type { RemoteParticipant } from "@/types/meeting-room";
import VideoTile from "./VideoTile";

interface VideoGridProps {
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  remotes: RemoteParticipant[];
  userName: string;
  isScreenSharing: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isHandRaised: boolean;
}

function getGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1 max-w-[640px] mx-auto";
  if (count <= 4) return "grid-cols-2";
  if (count <= 6) return "grid-cols-3";
  return "grid-cols-3";
}

export default function VideoGrid({
  localStream,
  screenStream,
  remotes,
  userName,
  isScreenSharing,
  isMicOn,
  isCamOn,
  isHandRaised,
}: VideoGridProps) {
  const totalParticipants = 1 + remotes.length;

  if (isScreenSharing && screenStream) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-[3] items-center justify-center p-2">
          <VideoTile
            stream={screenStream}
            userName={`${userName}'s screen`}
            muted
            isScreenShare
          />
        </div>

        <div className="flex w-52 flex-col gap-2 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
          <VideoTile
            stream={localStream}
            userName={`${userName} (You)`}
            muted
            small
            isMicMuted={!isMicOn}
            isCamOff={!isCamOn}
            isHandRaised={isHandRaised}
          />
          {remotes.map((r) => (
            <VideoTile
              key={r.peerId}
              stream={r.stream}
              userName={r.userName}
              small
              isMicMuted={r.isMuted}
              isCamOff={r.isCamOff}
              isHandRaised={r.isHandRaised}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
      <div
        className={`grid w-full gap-3 ${getGridClass(totalParticipants)} ${
          totalParticipants > 9 ? "max-h-full overflow-y-auto" : ""
        }`}
      >
        <VideoTile
          stream={localStream}
          userName={`${userName} (You)`}
          muted
          isMicMuted={!isMicOn}
          isCamOff={!isCamOn}
          isHandRaised={isHandRaised}
        />
        {remotes.map((r) => (
          <VideoTile
            key={r.peerId}
            stream={r.stream}
            userName={r.userName}
            isMicMuted={r.isMuted}
            isCamOff={r.isCamOff}
            isHandRaised={r.isHandRaised}
          />
        ))}
      </div>
    </div>
  );
}
