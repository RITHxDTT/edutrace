"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";
import { useWebRTC } from "../hooks/useWebRTC";
import { useStompChat } from "../hooks/useStompChat";
import { useMeetingParticipants } from "../hooks/useMeetingParticipants";
import VideoGrid from "./VideoGrid";
import MeetingToolbar from "./MeetingToolbar";
import ChatPanel from "./ChatPanel";
import ParticipantsPanel from "./ParticipantsPanel";
import PreJoinLobby from "./PreJoinLobby";
import PipTile from "./PipTile";

interface CommunicationRoomProps {
  meetingRoomId: string;
  onLeave?: () => void;
  readOnly?: boolean;
  enablePip?: boolean;
}

export default function CommunicationRoom({
  meetingRoomId,
  onLeave,
  readOnly = false,
  enablePip = false,
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

  // PiP state
  const [pipDismissed, setPipDismissed] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const nativePipVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

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
    communicationTabActive,
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

  // Attach local stream to the hidden native PiP video element
  useEffect(() => {
    const video = nativePipVideoRef.current;
    if (!video) return;
    video.srcObject = localStream ?? null;
    if (localStream) video.play().catch(() => {});
  }, [localStream]);

  // Reset pipDismissed each time the user comes back to the communication tab
  useEffect(() => {
    if (communicationTabActive) setPipDismissed(false);
  }, [communicationTabActive]);

  // Native browser PiP: trigger when the browser tab/window is hidden
  useEffect(() => {
    if (!enablePip || !joined) return;

    const handleVisibilityChange = async () => {
      const video = nativePipVideoRef.current;
      if (!video) return;

      if (document.visibilityState === "hidden") {
        const pipEnabled =
          "pictureInPictureEnabled" in document && document.pictureInPictureEnabled;
        if (pipEnabled && !document.pictureInPictureElement) {
          try {
            await video.requestPictureInPicture();
          } catch {
            // Browser may deny PiP (no prior interaction, policy, etc.) — fail silently
          }
        }
      } else {
        if (document.pictureInPictureElement === video) {
          try {
            await document.exitPictureInPicture();
          } catch {}
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enablePip, joined]);

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

  // Custom PiP tile: show when the student has joined but is on another tab
  const showCustomPip =
    enablePip && joined && !communicationTabActive && !pipDismissed && !!localStream;

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
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
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
          className={`absolute right-0 top-0 z-20 h-full transition-all duration-300 ease-in-out ${
            chatPanelOpen
              ? "w-[320px] opacity-100"
              : "pointer-events-none w-0 overflow-hidden opacity-0"
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
          className={`absolute right-0 top-0 z-20 h-full transition-all duration-300 ease-in-out ${
            participantsPanelOpen
              ? "w-[320px] opacity-100"
              : "pointer-events-none w-0 overflow-hidden opacity-0"
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

      {/*
       * Tiny hidden video rendered at body level via portal.
       * Stays accessible for requestPictureInPicture() even when the
       * communication tab wrapper is scrolled/hidden by CSS.
       */}
      {enablePip && isBrowser &&
        createPortal(
          <video
            ref={nativePipVideoRef}
            autoPlay
            playsInline
            muted
            aria-hidden="true"
            style={{
              position: "fixed",
              width: 2,
              height: 2,
              bottom: 0,
              right: 0,
              opacity: 0,
              pointerEvents: "none",
              zIndex: -1,
            }}
          />,
          document.body,
        )}

      {/* Custom floating PiP overlay — shows when off the communication tab.
          When screen sharing, prefer the screen stream over the camera stream. */}
      {showCustomPip && (
        <PipTile
          stream={screenSharing && screenStream ? screenStream : localStream}
          isScreenShare={screenSharing && !!screenStream}
          userName={screenSharing && screenStream ? `${userName}'s screen` : `${userName} (You)`}
          isMicOn={micOn}
          isCamOn={screenSharing && !!screenStream ? true : camOn}
          isScreenSharing={screenSharing}
          profileImageUrl={profileImageUrl}
          onClose={() => setPipDismissed(true)}
          onToggleMic={screenSharing && screenStream ? undefined : toggleMic}
          onToggleCam={screenSharing && screenStream ? undefined : toggleCam}
          onToggleScreen={toggleScreen}
        />
      )}
    </div>
  );
}
