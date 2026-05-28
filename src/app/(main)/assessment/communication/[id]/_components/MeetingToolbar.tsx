"use client";

interface MeetingToolbarProps {
  micOn: boolean;
  camOn: boolean;
  screenSharing: boolean;
  raiseHand: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreen: () => void;
  onLeave: () => void;
  onToggleRaiseHand: () => void;
}

function ToolBtn({
  active,
  danger,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const activeStyle = {
    background:
      "linear-gradient(to bottom, #241cab 37%, #5d53f9 82%)",
    color: "white",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      style={active ? activeStyle : undefined}
      className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors ${danger
        ? "bg-red-500 text-white hover:bg-red-600"
        : active
          ? "hover:opacity-90 text-white"
          : "bg-[#E9F6FF] text-gray-700 hover:bg-[#dff2ff]"
        }`}
    >
      {children}
    </button>
  );
}
// --- inline SVG icons ---
const MicOnIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10a7 7 0 0 1-14 0M12 19v4M8 23h8" />
  </svg>
);
const MicOffIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v2a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16.95A7 7 0 0 1 5 10v-1m14 0v1a7 7 0 0 1-.11 1.23M12 19v4M8 23h8" />
  </svg>
);
const CamOnIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);
const CamOffIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h2a2 2 0 0 1 2 2v9.34m-7.72-2.06A4 4 0 0 1 7.72 7.72" />
    <polygon points="23 7 16 12 23 17 23 7" />
  </svg>
);
const ScreenIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <polyline points="8 10 12 6 16 10" />
    <line x1="12" y1="6" x2="12" y2="14" />
  </svg>
);
const LeaveIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
  </svg>
);

const RaiseHandIcon = () => (
  <svg
    className="h-10 w-10"
    fill="none"
    stroke="currentColor"
    strokeWidth={1}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 11V6a1 1 0 0 1 2 0v5m0 0V4a1 1 0 1 1 2 0v7m0 0V5a1 1 0 1 1 2 0v6m0 0V7a1 1 0 1 1 2 0v4m0 0v2a5 5 0 0 1-10 0v-2"
    />
  </svg>
);

export default function MeetingToolbar({
  micOn,
  camOn,
  screenSharing,
  raiseHand,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onToggleRaiseHand,
  onLeave,
}: MeetingToolbarProps) {
  return (
    <div
      className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl backdrop-blur"
    >
      <ToolBtn active={micOn} onClick={onToggleMic} title={micOn ? "Mute" : "Unmute"}>
        {micOn ? <MicOnIcon /> : <MicOffIcon />}
        {micOn}
      </ToolBtn>

      <ToolBtn active={camOn} onClick={onToggleCam} title={camOn ? "Turn off camera" : "Turn on camera"}>
        {camOn ? <CamOnIcon /> : <CamOffIcon />}
        {camOn}
      </ToolBtn>

      <ToolBtn active={screenSharing} onClick={onToggleScreen} title={screenSharing ? "Stop sharing" : "Share screen"}>
        <ScreenIcon />
        {screenSharing}
      </ToolBtn>

      <ToolBtn
        active={raiseHand}
        onClick={onToggleRaiseHand}
        title={raiseHand ? "Lower hand" : "Raise hand"}
      >
        <RaiseHandIcon />
        {raiseHand}
      </ToolBtn>

      <ToolBtn danger onClick={onLeave} title="Leave meeting">
        <LeaveIcon />
      </ToolBtn>
    </div>
  );
}