"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";
import { useWebRTC } from "../hooks/useWebRTC";
import { useStompChat } from "../hooks/useStompChat";
import { useMeetingParticipants } from "../hooks/useMeetingParticipants";
import RoomHeader from "./RoomHeader";
import VideoGrid from "./VideoGrid";
import MeetingToolbar from "./MeetingToolbar";
import ChatPanel from "./ChatPanel";
import ParticipantsPanel from "./ParticipantsPanel";

interface CommunicationRoomProps {
  meetingRoomId: string;
  onLeave?: () => void;
}

export default function CommunicationRoom({
  meetingRoomId,
  onLeave,
}: CommunicationRoomProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const accessToken = (session as { access_token?: string } | null)
    ?.access_token ?? "";
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
  

  const { chatPanelOpen, participantsPanelOpen, micOn, camOn, handRaised, screenSharing, reset } =
    useMeetingRoomStore();

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
    accessToken,
    profileImageUrl,
  });

  const { messages, sendMessage, loadMore, hasMore, isConnected } =
    useStompChat({
      meetingRoomId,
      accessToken,
    });

  const { participants } = useMeetingParticipants({
    meetingRoomId,
    accessToken,
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

  function handleSendMessage(content: string) {
    sendMessage(content);
  }

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Loading session...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-280px)] flex-col bg-[#1a1a2e] rounded-2xl overflow-hidden">
      <RoomHeader roomName="Communication Room" meetingRoomId={meetingRoomId} />

      <div className="flex flex-1 overflow-hidden">
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

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            chatPanelOpen ? "w-[360px] opacity-100" : "w-0 opacity-0"
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
            onSend={handleSendMessage}
          />
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            participantsPanelOpen ? "w-[360px] opacity-100" : "w-0 opacity-0"
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
