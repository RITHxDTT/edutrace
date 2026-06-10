"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { getMeetingRoomStompBrokerUrl } from "@/lib/meeting-room-stomp";
import {
  getActiveUsers,
  joinMeetingRoom,
  leaveMeetingRoom,
} from "@/services/meeting-room.service";
import type { MeetingActiveUser, PresenceResponse } from "@/types/meeting-room";
import Image from "next/image";
import { People } from "iconsax-react";

interface Props {
  meetingRoomId: string;
  isTeacher: boolean;
}

export default function AssessmentPresenceTracker({
  meetingRoomId,
  isTeacher,
}: Props) {
  const { data: session, status } = useSession();
  const token =
    (session as { access_token?: string } | null)?.access_token ?? "";

  const [activeUsers, setActiveUsers] = useState<MeetingActiveUser[]>([]);
  const [expanded, setExpanded] = useState(false);
  const hasJoinedRef = useRef(false);

  // ── Join on mount, leave on unmount / page close (students only) ─────────
  useEffect(() => {
    if (isTeacher || status !== "authenticated" || !token || !meetingRoomId) return;

    joinMeetingRoom(meetingRoomId, token).catch(console.warn);
    hasJoinedRef.current = true;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

    const handleExit = () => {
      if (!hasJoinedRef.current) return;
      hasJoinedRef.current = false;
      fetch(`${apiBase}/meeting-room/${meetingRoomId}/leave`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true,
      }).catch(() => {});
    };

    window.addEventListener("beforeunload", handleExit);
    window.addEventListener("pagehide", handleExit);

    return () => {
      window.removeEventListener("beforeunload", handleExit);
      window.removeEventListener("pagehide", handleExit);
      if (hasJoinedRef.current) {
        hasJoinedRef.current = false;
        leaveMeetingRoom(meetingRoomId, token).catch(console.warn);
      }
    };
  }, [meetingRoomId, token, status]);

  // ── Teacher only: initial fetch + real-time STOMP presence ───────────────
  useEffect(() => {
    if (!isTeacher || status !== "authenticated" || !token || !meetingRoomId)
      return;

    getActiveUsers(meetingRoomId, token)
      .then(setActiveUsers)
      .catch(console.warn);

    const client = new Client({
      brokerURL: getMeetingRoomStompBrokerUrl(),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(
          `/topic/meeting-room/${meetingRoomId}/presence`,
          (frame) => {
            try {
              const data = JSON.parse(frame.body) as PresenceResponse;
              if (Array.isArray(data.activeUsers)) {
                setActiveUsers(data.activeUsers);
              }
            } catch {}
          },
        );
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [isTeacher, meetingRoomId, token, status]);

  // Students: invisible — only here for join/leave side effects
  if (!isTeacher) return null;

  const count = activeUsers.length;

  // How many avatars to show in the stack changes with breakpoint.
  // We can't read CSS breakpoints at runtime easily, so we cap at 4 (safe for
  // all sizes above md where the stack is shown).
  const STACK_MAX = 4;

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* ── Summary row ─────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 sm:gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        {/* Live pulsing dot — always visible */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>

        {/* "LIVE" label — hidden below sm */}
        <span className="hidden sm:block text-xs font-bold tracking-widest text-green-600 uppercase shrink-0">
          Live
        </span>

        {/* Divider — hidden below sm */}
        <div className="hidden sm:block h-4 w-px bg-gray-200 shrink-0" />

        {/* People icon — hidden below md */}
        <People size={16} className="hidden md:block text-gray-400 shrink-0" />

        {/* Count — always visible; verbose label hidden below sm */}
        <span className="text-sm font-semibold text-gray-800 shrink-0">
          {count}{" "}
          <span className="font-normal text-gray-500">
            {/* Full label on sm+, short on xs */}
            <span className="hidden sm:inline">
              {count === 1 ? "student" : "students"} currently active
            </span>
            <span className="sm:hidden">active</span>
          </span>
        </span>

        {/* Avatar stack — only shown md+; bounded so it never overflows */}
        {count > 0 && (
          <div className="hidden md:flex items-center shrink-0 ml-1">
            {/* Divider before stack */}
            <div className="h-4 w-px bg-gray-200 mr-3" />
            <div className="flex -space-x-2">
              {activeUsers.slice(0, STACK_MAX).map((user) => (
                <UserAvatar key={user.userId} user={user} size={28} />
              ))}
            </div>
            {count > STACK_MAX && (
              <div className="flex h-7 w-7 -ml-2 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#EEEFFF] text-[10px] font-semibold text-[#2E25C9]">
                +{count - STACK_MAX}
              </div>
            )}
          </div>
        )}

        {/* Expand/collapse chevron — always visible, pushed to far right */}
        <svg
          className={`ml-auto size-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* ── Expanded user list ───────────────────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-gray-100">
          {count === 0 ? (
            <p className="px-4 py-5 text-sm text-gray-400 text-center">
              No students are currently active.
            </p>
          ) : (
            <ul className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {activeUsers.map((user) => (
                <li
                  key={user.userId}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <UserAvatar user={user} size={36} />

                  {/* Name + email — truncate handles long values */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.username}
                    </p>
                  </div>

                  {/* Active badge — dot always visible; "Active" text hidden on xs */}
                  <span className="ml-auto flex items-center gap-1.5 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="hidden sm:inline text-xs text-green-600">
                      Active
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function UserAvatar({
  user,
  size,
}: {
  user: MeetingActiveUser;
  size: number;
}) {
  return (
    <div
      title={`${user.firstName} ${user.lastName}`}
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-white overflow-hidden shrink-0 bg-gray-100"
    >
      {user.profileImage ? (
        <Image
          src={user.profileImage}
          alt={`${user.firstName} ${user.lastName}`}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          unoptimized
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-white font-semibold"
          style={{
            fontSize: size * 0.38,
            background: "linear-gradient(to bottom, #241cab 37%, #5d53f9 82%)",
          }}
        >
          {user.firstName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
