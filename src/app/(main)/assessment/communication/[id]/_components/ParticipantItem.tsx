"use client";

import type { MeetingParticipant } from "@/types/meeting-room";

interface ParticipantItemProps {
  participant: MeetingParticipant;
  isHandRaised?: boolean;
}

export default function ParticipantItem({
  participant,
  isHandRaised = false,
}: ParticipantItemProps) {
  const fullName = `${participant.firstName} ${participant.lastName}`;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
      {participant.profileImageUrl ? (
        <img
          src={participant.profileImageUrl}
          alt={fullName}
          className="h-9 w-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#241cab] to-[#5d53f9] text-sm font-semibold text-white flex-shrink-0">
          {participant.firstName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{fullName}</p>
        <p className="text-xs text-gray-400 capitalize">{participant.role}</p>
      </div>

      <div className="flex items-center gap-1.5">
        {isHandRaised && <span className="text-sm">✋</span>}
        {participant.role === "teacher" && (
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700">
            Host
          </span>
        )}
      </div>
    </div>
  );
}
