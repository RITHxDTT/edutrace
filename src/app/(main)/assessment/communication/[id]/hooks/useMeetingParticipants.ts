"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MeetingParticipant } from "@/types/meeting-room";
import { getActiveUsers } from "@/services/meeting-room.service";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";

interface UseMeetingParticipantsOptions {
  meetingRoomId: string;
  accessToken: string;
  pollInterval?: number;
}

export function useMeetingParticipants({
  meetingRoomId,
  accessToken,
  pollInterval = 15000,
}: UseMeetingParticipantsOptions) {
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchParticipants = useCallback(async () => {
    try {
      const users = await getActiveUsers(meetingRoomId, accessToken);
      setParticipants(users);
      useMeetingRoomStore.getState().setParticipantCount(users.length);
    } catch {
      // Backend may be unreachable
    } finally {
      setIsLoading(false);
    }
  }, [meetingRoomId, accessToken]);

  useEffect(() => {
    fetchParticipants();

    intervalRef.current = setInterval(fetchParticipants, pollInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchParticipants, pollInterval]);

  return {
    participants,
    count: participants.length,
    isLoading,
    refetch: fetchParticipants,
  };
}
