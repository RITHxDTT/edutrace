export interface MeetingRoom {
  meetingRoomId: string;
  assessmentId: string;
  title: string;
  status: "OPENED" | "CLOSED";
  createdAt: string;
}

export interface MeetingActiveUser {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}

export interface MeetingMember {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  classroomName: string;
  profileImage: string;
}

export interface MeetingParticipantSession {
  meetingParticipantSessionId: string;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  joinedAt: string;
  leftAt: string | null;
}

export interface MeetingRoomStats {
  totalMembers: number;
  activeCount: number;
}

export interface PeerInfo {
  userId: string;
  peerId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  joinedAt: string;
}

export interface PeerEventResponse {
  type: "JOINED" | "LEFT" | "SYNC";
  peer: PeerInfo | null;
  activeCount: number;
  peers: PeerInfo[];
}

export interface PeerPresenceResponse {
  activeCount: number;
  peers: PeerInfo[];
}

export interface PresenceResponse {
  activeCount: number;
  activeUsers: MeetingActiveUser[];
}

export interface RemoteParticipant {
  peerId: string;
  userName: string;
  userId?: string;
  stream: MediaStream | null;
  isMuted?: boolean;
  isCamOff?: boolean;
  isHandRaised?: boolean;
  isScreenSharing?: boolean;
  profileImageUrl?: string | undefined;
}
