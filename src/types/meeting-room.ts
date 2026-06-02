export interface MeetingRoom {
  meetingRoomId: string;
  assessmentId: string;
  title: string;
  status: "OPENED" | "CLOSED";
  createdAt: string;
}

export interface MeetingParticipant {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  role: "teacher" | "student";
  joinedAt: string;
}

export interface MeetingRoomStats {
  totalMembers: number;
  activeCount: number;
}

export interface PeerInfo {
  peerId: string;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  joinedAt: string;
}

export interface PeerPresenceResponse {
  activeCount: number;
  peers: PeerInfo[];
}

export interface RemoteParticipant {
  peerId: string;
  userName: string;
  userId?: string;
  stream: MediaStream | null;
  isMuted?: boolean;
  isCamOff?: boolean;
  isHandRaised?: boolean;
}
