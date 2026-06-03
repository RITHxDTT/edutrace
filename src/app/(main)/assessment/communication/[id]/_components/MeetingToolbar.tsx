"use client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MessageSquare,
  Users,
  PhoneOff,
  Hand,
} from "lucide-react";
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

  return (
    <div className="flex items-center justify-center gap-3 px-6 py-3">
      <ToolBtn
        active={micOn}
        onClick={onToggleMic}
        title={micOn ? "Mute" : "Unmute"}
      >
        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
      </ToolBtn>

      <ToolBtn
        active={camOn}
        onClick={onToggleCam}
        title={camOn ? "Turn off camera" : "Turn on camera"}
      >
        {camOn ? <Video size={20} /> : <VideoOff size={20} />}
      </ToolBtn>

      <ToolBtn
        active={screenSharing}
        onClick={onToggleScreen}
        title={screenSharing ? "Stop sharing" : "Share screen"}
      >
        <ScreenShare size={20} />
      </ToolBtn>

      <ToolBtn
        active={handRaised}
        onClick={onToggleRaiseHand}
        title={handRaised ? "Lower hand" : "Raise hand"}
      >
        <Hand size={20} fill={handRaised ? "currentColor" : "none"} />
      </ToolBtn>


      <div className="mx-1 h-8 w-px bg-gray-300" />

      <ToolBtn
        active={chatPanelOpen}
        onClick={toggleChatPanel}
        title="Chat"
        badge={chatPanelOpen ? undefined : unreadMessageCount}
      >
        <MessageSquare size={20} />
      </ToolBtn>

      <ToolBtn
        active={participantsPanelOpen}
        onClick={toggleParticipantsPanel}
        title="Participants"
        badge={participantCount}
      >
        <Users size={20} />
      </ToolBtn>

      <div className="mx-1 h-8 w-px bg-gray-300" />

      <ToolBtn danger onClick={onLeave} title="Leave meeting">
        <PhoneOff size={20} />
      </ToolBtn>
    </div>
  );
}
