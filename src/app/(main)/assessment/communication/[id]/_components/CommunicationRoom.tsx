"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";
import { useWebRTC } from "../hooks/useWebRTC";
import { useStompChat } from "../hooks/useStompChat";
import { useMeetingParticipants } from "../hooks/useMeetingParticipants";
import VideoGrid from "./VideoGrid";
import MeetingToolbar from "./MeetingToolbar";
import ChatPanel from "./ChatPanel";
import ParticipantsPanel from "./ParticipantsPanel";
import PreJoinLobby from "./PreJoinLobby";

interface CommunicationRoomProps {
  meetingRoomId: string;
  onLeave?: () => void;
  readOnly?: boolean;
}

export default function CommunicationRoom({
  meetingRoomId,
  onLeave,
  readOnly = false,
}: CommunicationRoomProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const accessToken =
    (session as { access_token?: string } | null)?.access_token ?? "";
  const user = session?.user as
    | {
        name?: string;
        userId?: string;
        firstName?: string;
        lastName?: string;
        profileImageUrl?: string;
      }
    | undefined;
  const userName = user?.name ?? user?.firstName ?? "Guest";
  const userId = user?.userId ?? "";
  const profileImageUrl = user?.profileImageUrl ?? undefined;

  const [joined, setJoined] = useState(false);
  const [preferredCamOn, setPreferredCamOn] = useState(true);
  const [preferredMicOn, setPreferredMicOn] = useState(true);

  // Delay WebRTC initialization until the user explicitly joins.
  // In read-only mode WebRTC never initializes; STOMP chat connects immediately.
  const effectiveToken = joined && accessToken ? accessToken : "";
  const chatToken = readOnly ? accessToken : effectiveToken;

  const {
    chatPanelOpen,
    participantsPanelOpen,
    micOn,
    camOn,
    handRaised,
    screenSharing,
    reset,
  } = useMeetingRoomStore();

  const {
    localStream,
    screenStream,
    remotes,
    toggleMic,
    toggleCam,
    toggleScreen,
    toggleRaiseHand,
  } = useWebRTC({
    meetingRoomId,
    userName,
    userId,
    accessToken: readOnly ? "" : effectiveToken,
    profileImageUrl,
    initialCamOn: preferredCamOn,
    initialMicOn: preferredMicOn,
  });

  const { messages, sendMessage, loadMore, hasMore, isConnected } =
    useStompChat({ meetingRoomId, accessToken: chatToken });

  const { participants } = useMeetingParticipants({
    meetingRoomId,
    accessToken: effectiveToken,
  });

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  function handleLeave() {
    reset();
    if (onLeave) {
      onLeave();
    } else {
      router.push("/assessment");
    }
  }

  if (!session) {
    return (
      <div className="flex h-[calc(100vh-40px)] items-center justify-center rounded-2xl bg-[#0c0c14] text-sm text-white/40">
        Loading…
      </div>
    );
  }

  if (readOnly) {
    return (
      <div className="flex h-[calc(100vh-40px)] flex-col overflow-hidden rounded-2xl bg-[#0c0c14]">
        <div className="flex items-center gap-3 border-b border-white/10 bg-[#16161f] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-white/80">
              This assessment is closed
            </p>
            <p className="mt-0.5 text-xs text-white/40">
              The video call is no longer available. You can browse the chat
              history below.
            </p>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <ChatPanel
            messages={messages}
            currentUserId={userId}
            hasMore={hasMore}
            isConnected={isConnected}
            meetingRoomId={meetingRoomId}
            accessToken={accessToken}
            onLoadMore={loadMore}
            onSend={() => {}}
            readOnly
          />
        </div>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="h-[calc(100vh-40px)] overflow-hidden rounded-2xl">
        <PreJoinLobby
          userName={userName}
          profileImageUrl={profileImageUrl}
          onJoin={(camOn, micOn) => {
            setPreferredCamOn(camOn);
            setPreferredMicOn(micOn);
            setJoined(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-40px)] flex-col overflow-hidden rounded-2xl bg-[#0c0c14]">
      {/* Video area */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        <VideoGrid
          localStream={localStream}
          screenStream={screenStream}
          remotes={remotes}
          userName={userName}
          isScreenSharing={screenSharing}
          isMicOn={micOn}
          isCamOn={camOn}
          isHandRaised={handRaised}
          profileImageUrl={profileImageUrl}
        />

        {/* Chat panel — glass overlay on the right */}
        <div
          className={`absolute right-0 top-0 z-20 h-[calc(100vh-40px)] transition-all duration-300 ease-in-out ${
            chatPanelOpen
              ? "w-[320px] opacity-100"
              : "pointer-events-none w-0 opacity-0 overflow-hidden"
          }`}
        >
          <ChatPanel
            messages={messages}
            currentUserId={userId}
            hasMore={hasMore}
            isConnected={isConnected}
            meetingRoomId={meetingRoomId}
            accessToken={accessToken}
            onLoadMore={loadMore}
            onSend={sendMessage}
          />
        </div>

        {/* Participants panel — glass overlay on the right */}
        <div
          className={`absolute right-0 top-0 z-20 h-[calc(100vh-40px)] transition-all duration-300 ease-in-out ${
            participantsPanelOpen
              ? "w-[320px] opacity-100"
              : "pointer-events-none w-0 opacity-0 overflow-hidden"
          }`}
        >
          <ParticipantsPanel participants={participants} />
        </div>
      </div>

      <MeetingToolbar
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleScreen={toggleScreen}
        onToggleRaiseHand={toggleRaiseHand}
        onLeave={handleLeave}
      />
    </div>
  );
}
