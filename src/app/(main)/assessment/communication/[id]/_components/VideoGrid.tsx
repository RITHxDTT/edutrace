"use client";

import { useMemo } from "react";
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
  profileImageUrl: string | undefined;
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
  profileImageUrl,
}: VideoGridProps) {
  const visibleRemotes = useMemo(() => {
    const byIdentity = new Map<string, RemoteParticipant>();

    remotes.forEach((remote) => {
      const key = remote.userId ?? remote.peerId;
      const existing = byIdentity.get(key);

      if (!existing) {
        byIdentity.set(key, remote);
        return;
      }

      const keepExistingStream = existing.stream && !remote.stream;
      byIdentity.set(key, {
        ...existing,
        ...remote,
        peerId: keepExistingStream ? existing.peerId : remote.peerId,
        stream: remote.stream ?? existing.stream,
      });
    });

    return Array.from(byIdentity.values());
  }, [remotes]);

  const remoteScreenShare = visibleRemotes.find(
    (remote) => remote.isScreenSharing && remote.stream,
  );
  const sidebarRemotes = remoteScreenShare
    ? visibleRemotes.filter((remote) => remote.peerId !== remoteScreenShare.peerId)
    : visibleRemotes;
  const totalParticipants = 1 + visibleRemotes.length;

  if ((isScreenSharing && screenStream) || remoteScreenShare) {
    const mainStream = screenStream ?? remoteScreenShare?.stream ?? null;
    const mainUserName =
      isScreenSharing && screenStream
        ? `${userName}'s screen`
        : `${remoteScreenShare?.userName ?? "Participant"}'s screen`;

    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-[3] items-center justify-center p-2">
          <VideoTile
            stream={mainStream}
            userName={mainUserName}
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
            profileImageUrl={profileImageUrl}
          />
          {sidebarRemotes.map((r) => (
            <VideoTile
              key={r.peerId}
              stream={r.stream}
              userName={r.userName}
              small
              isMicMuted={r.isMuted}
              isCamOff={r.isCamOff && !r.isScreenSharing}
              isHandRaised={r.isHandRaised}
              profileImageUrl={r.profileImageUrl}
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
          profileImageUrl={profileImageUrl}
        />
        {visibleRemotes.map((r) => (
          <VideoTile
            key={r.peerId}
            stream={r.stream}
            userName={r.userName}
            isMicMuted={r.isMuted}
            isCamOff={r.isCamOff && !r.isScreenSharing}
            isHandRaised={r.isHandRaised}
            profileImageUrl={r.profileImageUrl}
          />
        ))}
      </div>
    </div>
  );
}
