"use client";

import type { ParticipantDisplay } from "../hooks/useMeetingParticipants";

interface ParticipantItemProps {
  participant: ParticipantDisplay;
}

export default function ParticipantItem({
  participant,
}: ParticipantItemProps) {
  const fullName = `${participant.firstName} ${participant.lastName}`;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/5">
      {participant.profileImage ? (
        <img
          src={participant.profileImage}
          alt={fullName}
          className="h-9 w-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#241cab] to-[#5d53f9] text-sm font-semibold text-white flex-shrink-0">
          {participant.firstName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-white">{fullName}</p>
        {participant.classroomName && (
          <p className="truncate text-xs text-white/40">
            {participant.classroomName}
          </p>
        )}
      </div>
    </div>
  );
}
