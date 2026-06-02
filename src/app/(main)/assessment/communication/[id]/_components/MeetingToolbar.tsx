"use client";

import { useState } from "react";
import {
  Microphone,
  MicrophoneSlash,
  Video as VideoIcon,
  VideoSlash,
  Monitor,
  ProfileAdd,
  Message,
  People,
  CallRemove,
} from "iconsax-react";
import { Hand } from "lucide-react";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";

interface MeetingToolbarProps {
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreen: () => void;
  onToggleRaiseHand: () => void;
  onLeave: () => void;
}

function ToolBtn({
  active,
  danger,
  onClick,
  title,
  badge,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  title: string;
  badge?: number;
  children: React.ReactNode;
}) {
  const activeStyle = {
    background: "linear-gradient(to bottom, #241cab 37%, #5d53f9 82%)",
    color: "white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={active ? activeStyle : undefined}
      className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
        danger
          ? "bg-red-500 text-white hover:bg-red-600"
          : active
            ? "text-white hover:opacity-90"
            : "bg-[#E9F6FF] text-gray-700 hover:bg-[#dff2ff]"
      }`}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

export default function MeetingToolbar({
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onToggleRaiseHand,
  onLeave,
}: MeetingToolbarProps) {
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  const {
    micOn,
    camOn,
    screenSharing,
    handRaised,
    chatPanelOpen,
    participantsPanelOpen,
    unreadMessageCount,
    participantCount,
    toggleChatPanel,
    toggleParticipantsPanel,
  } = useMeetingRoomStore();

  async function handleCopyInviteLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedInviteLink(true);
    setTimeout(() => setCopiedInviteLink(false), 2000);
  }

  return (
    <div className="flex items-center justify-center gap-3 px-6 py-3">
      <ToolBtn
        active={micOn}
        onClick={onToggleMic}
        title={micOn ? "Mute" : "Unmute"}
      >
        {micOn ? (
          <Microphone size={20} variant="Bold" />
        ) : (
          <MicrophoneSlash size={20} variant="Bold" />
        )}
      </ToolBtn>

      <ToolBtn
        active={camOn}
        onClick={onToggleCam}
        title={camOn ? "Turn off camera" : "Turn on camera"}
      >
        {camOn ? (
          <VideoIcon size={20} variant="Bold" />
        ) : (
          <VideoSlash size={20} variant="Bold" />
        )}
      </ToolBtn>

      <ToolBtn
        active={screenSharing}
        onClick={onToggleScreen}
        title={screenSharing ? "Stop sharing" : "Share screen"}
      >
        <Monitor size={20} variant="Bold" />
      </ToolBtn>

      <ToolBtn
        active={handRaised}
        onClick={onToggleRaiseHand}
        title={handRaised ? "Lower hand" : "Raise hand"}
      >
        <Hand size={20} fill={handRaised ? "currentColor" : "none"} />
      </ToolBtn>

      <ToolBtn
        onClick={handleCopyInviteLink}
        title={copiedInviteLink ? "Invite link copied" : "Copy invite link"}
      >
        <ProfileAdd size={20} variant="Bold" />
      </ToolBtn>

      <div className="mx-1 h-8 w-px bg-gray-300" />

      <ToolBtn
        active={chatPanelOpen}
        onClick={toggleChatPanel}
        title="Chat"
        badge={chatPanelOpen ? undefined : unreadMessageCount}
      >
        <Message size={20} variant="Bold" />
      </ToolBtn>

      <ToolBtn
        active={participantsPanelOpen}
        onClick={toggleParticipantsPanel}
        title="Participants"
        badge={participantCount}
      >
        <People size={20} variant="Bold" />
      </ToolBtn>

      <div className="mx-1 h-8 w-px bg-gray-300" />

      <ToolBtn danger onClick={onLeave} title="Leave meeting">
        <CallRemove size={20} variant="Bold" />
      </ToolBtn>
    </div>
  );
}
