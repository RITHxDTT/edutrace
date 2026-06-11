import type {
  MeetingRoom,
  MeetingActiveUser,
  MeetingMember,
  MeetingRoomStats,
  PeerPresenceResponse,
} from "@/types/meeting-room";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function authOnly(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `Request failed: ${res.status}`);
  }
  return json.payload as T;
}

export async function getMeetingRoom(
  meetingRoomId: string,
  token: string,
): Promise<MeetingRoom> {
  const res = await fetch(`${API}/meeting-room/${meetingRoomId}`, {
    headers: headers(token),
  });
  return unwrap<MeetingRoom>(res);
}

export async function joinMeetingRoom(
  meetingRoomId: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${API}/meeting-room/${meetingRoomId}/join`, {
    method: "POST",
    headers: authOnly(token),
  });
  if (!res.ok) throw new Error(`Failed to join room: ${res.status}`);
}

export async function leaveMeetingRoom(
  meetingRoomId: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${API}/meeting-room/${meetingRoomId}/leave`, {
    method: "POST",
    headers: authOnly(token),
  });
  if (!res.ok) throw new Error(`Failed to leave room: ${res.status}`);
}

export async function getActiveUsers(
  meetingRoomId: string,
  token: string,
): Promise<MeetingActiveUser[]> {
  const res = await fetch(`${API}/meeting-room/${meetingRoomId}/active-users`, {
    headers: headers(token),
  });
  return unwrap<MeetingActiveUser[]>(res);
}

export async function getMembers(
  meetingRoomId: string,
  token: string,
): Promise<MeetingMember[]> {
  const res = await fetch(`${API}/meeting-room/${meetingRoomId}/members`, {
    headers: headers(token),
  });
  return unwrap<MeetingMember[]>(res);
}

export async function getMeetingRoomStats(
  meetingRoomId: string,
  token: string,
): Promise<MeetingRoomStats> {
  const res = await fetch(`${API}/meeting-room/${meetingRoomId}/stats`, {
    headers: headers(token),
  });
  return unwrap<MeetingRoomStats>(res);
}

export async function registerPeer(
  meetingRoomId: string,
  peerId: string,
  token: string,
): Promise<PeerPresenceResponse> {
  const res = await fetch(`${API}/meeting-room/${meetingRoomId}/peers`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ peerId }),
  });
  return unwrap<PeerPresenceResponse>(res);
}

export async function unregisterPeer(
  meetingRoomId: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${API}/meeting-room/${meetingRoomId}/peers/leave`, {
    method: "POST",
    headers: authOnly(token),
  });
  if (!res.ok) throw new Error(`Failed to unregister peer: ${res.status}`);
}

export async function getActivePeers(
  meetingRoomId: string,
  token: string,
): Promise<PeerPresenceResponse> {
  const res = await fetch(`${API}/meeting-room/${meetingRoomId}/peers`, {
    headers: headers(token),
  });
  return unwrap<PeerPresenceResponse>(res);
}

export async function getMeetingRoomByAssessment(
  assessmentId: string,
  token: string,
): Promise<MeetingRoom> {
  const res = await fetch(
    `${API}/assessments/${assessmentId}/meetingRoom`,
    { headers: headers(token) },
  );
  return unwrap<MeetingRoom>(res);
}
