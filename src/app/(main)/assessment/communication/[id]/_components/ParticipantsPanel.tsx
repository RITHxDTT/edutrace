"use client";

import { useMemo } from "react";
import type { ParticipantDisplay } from "../hooks/useMeetingParticipants";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";
import ParticipantItem from "./ParticipantItem";

interface ParticipantsPanelProps {
  participants: ParticipantDisplay[];
}

export default function ParticipantsPanel({
  participants,
}: ParticipantsPanelProps) {
  const toggleParticipantsPanel = useMeetingRoomStore(
    (s) => s.toggleParticipantsPanel,
  );
  const visibleParticipants = useMemo(
    () => Array.from(new Map(participants.map((p) => [p.userId, p])).values()),
    [participants],
  );

  return (
    <div className="flex h-full w-full flex-col border-l border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">
          Participants ({visibleParticipants.length})
        </h3>
        <button
          onClick={toggleParticipantsPanel}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
        {visibleParticipants.map((p) => (
          <ParticipantItem key={p.userId} participant={p} />
        ))}

        {visibleParticipants.length === 0 && (
          <div className="flex items-center justify-center py-12 text-sm text-white/40">
            No participants yet
          </div>
        )}
      </div>
    </div>
  );
}
