"use client";

import type { MeetingParticipant } from "@/types/meeting-room";
import type { RemoteParticipant } from "@/types/meeting-room";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";
import ParticipantItem from "./ParticipantItem";

interface ParticipantsPanelProps {
  participants: MeetingParticipant[];
  remotes: RemoteParticipant[];
}

export default function ParticipantsPanel({
  participants,
  remotes,
}: ParticipantsPanelProps) {
  const toggleParticipantsPanel = useMeetingRoomStore(
    (s) => s.toggleParticipantsPanel,
  );

  const raisedPeerIds = new Set(
    remotes.filter((r) => r.isHandRaised).map((r) => r.peerId),
  );

  const teachers = participants.filter((p) => p.role === "teacher");
  const students = participants.filter((p) => p.role === "student");

  return (
    <div className="flex min-w-[360px] w-[360px] flex-col border-l border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Participants ({participants.length})
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
        {teachers.length > 0 && (
          <div>
            <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Teachers ({teachers.length})
            </p>
            {teachers.map((p) => (
              <ParticipantItem
                key={p.userId}
                participant={p}
                isHandRaised={raisedPeerIds.has(p.userId)}
              />
            ))}
          </div>
        )}

        {students.length > 0 && (
          <div>
            <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Students ({students.length})
            </p>
            {students.map((p) => (
              <ParticipantItem
                key={p.userId}
                participant={p}
                isHandRaised={raisedPeerIds.has(p.userId)}
              />
            ))}
          </div>
        )}

        {participants.length === 0 && (
          <div className="flex items-center justify-center py-12 text-sm text-gray-400">
            No participants yet
          </div>
        )}
      </div>
    </div>
  );
}
