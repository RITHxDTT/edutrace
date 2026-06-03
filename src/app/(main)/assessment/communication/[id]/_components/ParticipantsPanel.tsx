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
    <div className="flex min-w-[360px] w-[360px] flex-col border-l border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Participants ({visibleParticipants.length})
        </h3>
        <button
          onClick={toggleParticipantsPanel}
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
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

      <div className="flex-1 overflow-y-auto">
        {visibleParticipants.map((p) => (
          <ParticipantItem key={p.userId} participant={p} />
        ))}

        {visibleParticipants.length === 0 && (
          <div className="flex items-center justify-center py-12 text-sm text-gray-400">
            No participants yet
          </div>
        )}
      </div>
    </div>
  );
}
