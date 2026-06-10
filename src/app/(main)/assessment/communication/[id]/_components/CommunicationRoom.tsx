"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Microphone, MicrophoneSlash, Video, VideoSlash } from "iconsax-react";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";
import { getMembers } from "@/services/meeting-room.service";
import type { MeetingMember } from "@/types/meeting-room";
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
  const [members, setMembers] = useState<MeetingMember[]>([]);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  // PiP state
  const [pipDismissed, setPipDismissed] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const nativePipVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (!accessToken || readOnly) return;
    getMembers(meetingRoomId, accessToken)
      .then(setMembers)
      .catch(() => {});
  }, [meetingRoomId, accessToken, readOnly]);

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

  // Re-play the hidden PiP video whenever PiP exits so it's ready for the next session.
  // Chrome pauses the video element when PiP closes, which causes the next
  // requestPictureInPicture() call to fail silently.
  useEffect(() => {
    if (!enablePip) return;
    const video = nativePipVideoRef.current;
    if (!video) return;
    const onLeave = () => video.play().catch(() => {});
    video.addEventListener("leavepictureinpicture", onLeave);
    return () => video.removeEventListener("leavepictureinpicture", onLeave);
  }, [enablePip]);

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
            // Ensure the video is playing — Chrome rejects PiP on a paused element
            if (video.paused) await video.play();
            await video.requestPictureInPicture();
          } catch {
            // Browser may deny PiP (no prior interaction, policy, etc.)
          }
        }
      } else {
        if (document.pictureInPictureElement === video) {
          try {
            await document.exitPictureInPicture();
          } catch {}
          // Re-play so the element is ready for the next hide event
          video.play().catch(() => {});
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

  function handleLeave(action: "back" | "disconnect") {
    setShowLeaveDialog(false);
    reset();
    if (action === "disconnect") {
      setJoined(false);
    } else if (onLeave) {
      onLeave();
    } else {
      router.back();
    }
  }

  // Custom PiP tile: show when the student has joined but is on another tab
  const showCustomPip =
    enablePip && joined && !communicationTabActive && !pipDismissed && !!localStream;

  // Collapsed "In Call" badge: shows after the user dismisses the PiP tile
  const showCallBadge =
    enablePip && joined && !communicationTabActive && pipDismissed;

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
            members={[]}
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
            members={members}
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
        onLeave={() => setShowLeaveDialog(true)}
      />

      {showLeaveDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-[#16161f] p-6 shadow-2xl ring-1 ring-white/10">
            <h2 className="text-base font-semibold text-white">Leave the call?</h2>
            <p className="mt-1.5 text-sm text-white/50">Choose where you want to go after leaving.</p>

            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={() => handleLeave("back")}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3.5 text-left transition-colors hover:bg-white/10 active:bg-white/15"
              >
                <div>
                  <p className="text-sm font-medium text-white">Back to Assessment</p>
                  <p className="text-xs text-white/40">Leave the call and return to the assessment page</p>
                </div>
              </button>

              <button
                onClick={() => handleLeave("disconnect")}
                className="flex items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3.5 text-left transition-colors hover:bg-red-500/20 active:bg-red-500/25"
              >
                <div>
                  <p className="text-sm font-medium text-red-400">Leave Call</p>
                  <p className="text-xs text-white/40">Disconnect without leaving this page</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowLeaveDialog(false)}
              className="mt-4 w-full rounded-xl py-2.5 text-sm text-white/40 transition-colors hover:text-white/70"
            >
              Stay in call
            </button>
          </div>
        </div>
      )}

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

      {/* Collapsed "In Call" badge — rendered as a portal so it appears on every page
          after the user dismisses the PiP tile. Click to restore the PiP. */}
      {showCallBadge && isBrowser &&
        createPortal(
          <button
            onClick={() => setPipDismissed(false)}
            title="You are still in the call — click to restore"
            className="fixed bottom-6 right-6 z-[9998] flex items-center gap-2.5 rounded-full bg-[#0c0c14]/90 px-4 py-2 shadow-2xl ring-1 ring-white/10 backdrop-blur-md transition-all hover:bg-[#1a1a2a]/90 hover:ring-white/20 active:scale-95"
          >
            {/* Pulsing live dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>

            <span className="text-xs font-semibold text-white/90">In Call</span>

            <span className="mx-0.5 h-3.5 w-px bg-white/20" />

            {micOn
              ? <Microphone size={14} variant="Bold" className="text-white/70" />
              : <MicrophoneSlash size={14} variant="Bold" className="text-red-400" />
            }
            {camOn
              ? <Video size={14} variant="Bold" className="text-white/70" />
              : <VideoSlash size={14} variant="Bold" className="text-red-400" />
            }
          </button>,
          document.body,
        )}
    </div>
  );
}
