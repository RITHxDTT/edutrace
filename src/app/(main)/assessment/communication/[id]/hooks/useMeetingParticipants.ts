"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import type {
  MeetingActiveUser,
  MeetingMember,
  PresenceResponse,
} from "@/types/meeting-room";
import { getActiveUsers, getMembers } from "@/services/meeting-room.service";
import { getMeetingRoomStompBrokerUrl } from "@/lib/meeting-room-stomp";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";

export interface ParticipantDisplay {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  classroomName?: string;
}

interface UseMeetingParticipantsOptions {
  meetingRoomId: string;
  accessToken: string;
}

export function useMeetingParticipants({
  meetingRoomId,
  accessToken,
}: UseMeetingParticipantsOptions) {
  const [participants, setParticipants] = useState<ParticipantDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const membersRef = useRef<Map<string, MeetingMember>>(new Map());
  const stompRef = useRef<Client | null>(null);

  function mergeWithMembers(activeUsers: MeetingActiveUser[]): ParticipantDisplay[] {
    const uniqueUsers = Array.from(
      new Map(activeUsers.map((user) => [user.userId, user])).values(),
    );

    return uniqueUsers.map((u) => {
      const member = membersRef.current.get(u.userId);
      return {
        userId: u.userId,
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        profileImage: u.profileImage,
        classroomName: member?.classroomName,
      };
    });
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!accessToken) return;

      try {
        const [activeUsers, members] = await Promise.all([
          getActiveUsers(meetingRoomId, accessToken),
          getMembers(meetingRoomId, accessToken).catch(() => [] as MeetingMember[]),
        ]);

        if (!mounted) return;

        membersRef.current.clear();
        members.forEach((m) => membersRef.current.set(m.userId, m));
        const merged = mergeWithMembers(activeUsers);
        setParticipants(merged);
        useMeetingRoomStore.getState().setParticipantCount(merged.length);
      } catch {
        // Backend may be unreachable
      } finally {
        if (mounted) setIsLoading(false);
      }

      const stomp = new Client({
        brokerURL: getMeetingRoomStompBrokerUrl(),
        connectHeaders: { Authorization: `Bearer ${accessToken}` },
        reconnectDelay: 5000,
        onConnect: () => {
          stomp.subscribe(
            `/topic/meeting-room/${meetingRoomId}/presence`,
            (frame) => {
              if (!mounted) return;
              const data = JSON.parse(frame.body) as PresenceResponse;
              const merged = mergeWithMembers(data.activeUsers);
              setParticipants(merged);
              useMeetingRoomStore.getState().setParticipantCount(merged.length);
            },
          );
        },
      });

      stomp.activate();
      stompRef.current = stomp;
    }

    init();

    return () => {
      mounted = false;
      stompRef.current?.deactivate();
    };
  }, [meetingRoomId, accessToken]);

  return {
    participants,
    count: participants.length,
    isLoading,
  };
}
