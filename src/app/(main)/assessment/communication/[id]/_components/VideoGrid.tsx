"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

// Maximum tiles per page — 16 gives a clean 4×4 worst case.
const MAX_PER_PAGE = 16;

// Number of columns that produces the most square-ish grid for N tiles.
// e.g. 3 → 2 cols (2×2), 5 → 3 cols (3×2), 7 → 3 cols (3×3)
function getCols(n: number): number {
  if (n <= 1) return 1;
  if (n <= 2) return 2;
  return Math.ceil(Math.sqrt(n));
}

type TileLocal = { kind: "local" };
type TileRemote = { kind: "remote"; remote: RemoteParticipant };
type Tile = TileLocal | TileRemote;

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
  const [page, setPage] = useState(0);

  // Deduplicate remotes by identity (userId takes priority over peerId)
  const visibleRemotes = useMemo<RemoteParticipant[]>(() => {
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

  // ── Screen-share layout ────────────────────────────────────────────────────
  const remoteScreenShare = visibleRemotes.find(
    (r) => r.isScreenSharing && r.stream,
  );
  const sidebarRemotes = remoteScreenShare
    ? visibleRemotes.filter((r) => r.peerId !== remoteScreenShare.peerId)
    : visibleRemotes;

  if ((isScreenSharing && screenStream) || remoteScreenShare) {
    // Local screen share: main=screenStream, sidebar camera=localStream (already shown below).
    // Remote screen share: main=r.screenStream (dedicated screen call), sidebar=r.stream (camera call).
    const mainStream = isScreenSharing && screenStream
      ? screenStream
      : (remoteScreenShare?.screenStream ?? null);

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
          {/* Screen sharer's camera tile — always present, shows avatar when cam is off */}
          {remoteScreenShare && (
            <VideoTile
              key={`${remoteScreenShare.peerId}-cam`}
              stream={remoteScreenShare.stream}
              userName={remoteScreenShare.userName}
              small
              isMicMuted={remoteScreenShare.isMuted}
              isCamOff={!!remoteScreenShare.isCamOff}
              isHandRaised={remoteScreenShare.isHandRaised}
              profileImageUrl={remoteScreenShare.profileImageUrl}
            />
          )}
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

  // ── Paginated grid layout ──────────────────────────────────────────────────
  const allTiles: Tile[] = [
    { kind: "local" },
    ...visibleRemotes.map((r): TileRemote => ({ kind: "remote", remote: r })),
  ];

  const totalPages = Math.max(1, Math.ceil(allTiles.length / MAX_PER_PAGE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageTiles = allTiles.slice(
    currentPage * MAX_PER_PAGE,
    (currentPage + 1) * MAX_PER_PAGE,
  );

  const cols = getCols(pageTiles.length);
  const rows = Math.ceil(pageTiles.length / cols);

  // How many participants are hidden across all other pages
  const hiddenCount = Math.max(
    0,
    allTiles.length - (currentPage + 1) * MAX_PER_PAGE,
  );

  return (
    // fill the entire flex-1 parent — both width and height
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* ── Video grid ────────────────────────────────────────────────────── */}
      <div
        className="min-h-0 flex-1 grid gap-2 p-3"
        style={{
          // Each column and row gets an equal share of the container so tiles
          // always fill the full height regardless of participant count.
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {pageTiles.map((tile) => {
          if (tile.kind === "local") {
            return (
              <VideoTile
                key="local"
                stream={localStream}
                userName={`${userName} (You)`}
                muted
                isMicMuted={!isMicOn}
                isCamOff={!isCamOn}
                isHandRaised={isHandRaised}
                profileImageUrl={profileImageUrl}
              />
            );
          }
          const r = tile.remote;
          return (
            <VideoTile
              key={r.peerId}
              stream={r.stream}
              userName={r.userName}
              isMicMuted={r.isMuted}
              isCamOff={r.isCamOff && !r.isScreenSharing}
              isHandRaised={r.isHandRaised}
              profileImageUrl={r.profileImageUrl}
            />
          );
        })}
      </div>

      {/* ── Prev page arrow ───────────────────────────────────────────────── */}
      {currentPage > 0 && (
        <button
          onClick={() => setPage((p) => p - 1)}
          title="Previous page"
          className="absolute left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white shadow-lg transition-colors hover:bg-black/70"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* ── Next page arrow ───────────────────────────────────────────────── */}
      {currentPage < totalPages - 1 && (
        <button
          onClick={() => setPage((p) => p + 1)}
          title={`Next page — ${hiddenCount} more participant${hiddenCount !== 1 ? "s" : ""}`}
          className="absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white shadow-lg transition-colors hover:bg-black/70"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* ── Page indicator ────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-2 pt-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-200 ${
                i === currentPage
                  ? "h-1.5 w-4 bg-white"
                  : "h-1.5 w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
          {hiddenCount > 0 && (
            <span className="ml-1 text-[11px] text-white/40">
              +{hiddenCount} on next {totalPages - currentPage - 1 > 1 ? "pages" : "page"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
