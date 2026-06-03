"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import VideoTile from "./_components/VideoTile";
import MeetingToolbar from "./_components/MeetingToolbar";
import NavbarTitle from "@/components/Topbar/NavbarTitle";

interface RemoteParticipant {
  peerId: string;
  userName: string;
  stream: MediaStream | null;
}

function CopyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export default function RoomPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  // Media state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);// Add to state declarations
  const [handRaised, setHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());

  // Participants
  const [remotes, setRemotes] = useState<RemoteParticipant[]>([]);

  // Copied feedback
  const [copied, setCopied] = useState(false);

  // Refs — never trigger re-renders
  const peerRef = useRef<import("peerjs").Peer | null>(null);
  const socketRef = useRef<Socket | null>(null);
  // Map of peerId -> MediaConnection so we can close them on leave
  const callsRef = useRef<Map<string, import("peerjs").MediaConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const userName: string =
    (session?.user as { name?: string } | undefined)?.name ?? "Guest";

  // ----------------------------------------------------------------
  // Copy room link
  // ----------------------------------------------------------------
  async function handleCopyLink() {
    const link = `${window.location.origin}/assessment/communication/${roomId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ----------------------------------------------------------------
  // Call a remote peer with our current local (or screen) stream
  // ----------------------------------------------------------------
  const callPeer = useCallback(
    (peerId: string, peerUserName: string, stream: MediaStream) => {
      if (!peerRef.current) return;

      const call = peerRef.current.call(peerId, stream, {
        metadata: { userName },
      });

      callsRef.current.set(peerId, call);

      call.on("stream", (remoteStream) => {
        setRemotes((prev) => {
          const idx = prev.findIndex((r) => r.peerId === peerId);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = { ...next[idx], stream: remoteStream };
            return next;
          }
          return [...prev, { peerId, userName: peerUserName, stream: remoteStream }];
        });
      });

      call.on("close", () => {
        setRemotes((prev) => prev.filter((r) => r.peerId !== peerId));
        callsRef.current.delete(peerId);
      });
    },
    [userName]
  );

  // ----------------------------------------------------------------
  // Main setup effect
  // ----------------------------------------------------------------
  useEffect(() => {
    let peer: import("peerjs").Peer;
    let socket: Socket;
    let mounted = true;

    const cleanupRoom = () => {
      socketRef.current?.disconnect();
      callsRef.current.forEach((c) => c.close());
      callsRef.current.clear();
      peerRef.current?.destroy();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    };

    async function init() {
      // 1. Get local media
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch {
        // Fallback: audio only
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          stream = new MediaStream();
        }
      }

      if (!mounted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      localStreamRef.current = stream;
      setLocalStream(stream);

      // 2. Init PeerJS (uses PeerJS cloud by default)
      const { Peer } = await import("peerjs");
      peer = new Peer();
      peerRef.current = peer;

      peer.on("open", (myPeerId) => {
        if (!mounted) return;

        // 3. Connect socket
        socket = io();
        socketRef.current = socket;

        // 4. Join room
        socket.emit("join-room", { roomId, peerId: myPeerId, userName });

        // 5. Someone already in the room — call them
        socket.on(
          "existing-users",
          (users: { peerId: string; userName: string }[]) => {
            users.forEach(({ peerId, userName: peerName }) => {
              const activeStream = screenStreamRef.current ?? localStreamRef.current;
              if (activeStream) callPeer(peerId, peerName, activeStream);
            });
          }
        );

        // 6. New user joined — they will call us; add them as placeholder
        socket.on(
          "user-joined",
          ({ peerId, userName: peerName }: { peerId: string; userName: string }) => {
            setRemotes((prev) => {
              if (prev.find((r) => r.peerId === peerId)) return prev;
              return [...prev, { peerId, userName: peerName, stream: null }];
            });
          }
        );

        // 7. User left
        socket.on("user-left", ({ peerId }: { peerId: string }) => {
          callsRef.current.get(peerId)?.close();
          callsRef.current.delete(peerId);
          setRemotes((prev) => prev.filter((r) => r.peerId !== peerId));
        });
      });

      // 8. Answer incoming calls
      peer.on("call", (call) => {
        const callerName: string = call.metadata?.userName ?? "Unknown";
        const activeStream = screenStreamRef.current ?? localStreamRef.current ?? new MediaStream();
        call.answer(activeStream);

        callsRef.current.set(call.peer, call);

        call.on("stream", (remoteStream) => {
          if (!mounted) return;
          setRemotes((prev) => {
            const idx = prev.findIndex((r) => r.peerId === call.peer);
            if (idx !== -1) {
              const next = [...prev];
              next[idx] = { ...next[idx], stream: remoteStream };
              return next;
            }
            return [...prev, { peerId: call.peer, userName: callerName, stream: remoteStream }];
          });
        });

        call.on("close", () => {
          setRemotes((prev) => prev.filter((r) => r.peerId !== call.peer));
          callsRef.current.delete(call.peer);
        });
      });
    }

    init();

    window.addEventListener("beforeunload", cleanupRoom);
    window.addEventListener("pagehide", cleanupRoom);

    return () => {
      mounted = false;
      window.removeEventListener("beforeunload", cleanupRoom);
      window.removeEventListener("pagehide", cleanupRoom);
      cleanupRoom();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userName]);

  // ----------------------------------------------------------------
  // Toolbar handlers
  // ----------------------------------------------------------------
  function handleToggleMic() {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setMicOn((prev) => !prev);
  }

  function handleToggleCam() {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setCamOn((prev) => !prev);
  }

  async function handleToggleScreen() {
    if (screenSharing) {
      // Stop sharing
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
      setScreenSharing(false);

      // Re-send local cam stream to all peers
      const camStream = localStreamRef.current;
      if (camStream) {
        callsRef.current.forEach((call) => {
          const sender = (call as unknown as { peerConnection?: RTCPeerConnection })
            .peerConnection?.getSenders()
            .find((s) => s.track?.kind === "video");
          const videoTrack = camStream.getVideoTracks()[0];
          if (sender && videoTrack) sender.replaceTrack(videoTrack);
        });
      }
    } else {
      try {
        const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = display;
        setScreenStream(display);
        setScreenSharing(true);

        // Replace video track for all active peer connections
        callsRef.current.forEach((call) => {
          const sender = (call as unknown as { peerConnection?: RTCPeerConnection })
            .peerConnection?.getSenders()
            .find((s) => s.track?.kind === "video");
          const screenTrack = display.getVideoTracks()[0];
          if (sender && screenTrack) sender.replaceTrack(screenTrack);
        });

        // Auto-stop when user clicks browser's "Stop sharing"
        display.getVideoTracks()[0].onended = () => {
          handleToggleScreen();
        };
      } catch {
        // User cancelled or permission denied
      }
    }
  }

  // Add handler function (alongside your other handlers)
  function handleToggleRaiseHand() {
    const newState = !handRaised;
    setHandRaised(newState);
    socketRef.current?.emit("raise-hand", { roomId, raised: newState, userName });
  }


  function handleLeave() {
    router.push("/assessment");
  }

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  const roomLink = typeof window !== "undefined"
    ? `${window.location.origin}/assessment/communication/${roomId}`
    : "";

  return (
    <div className="flex h-screen flex-col bg-white text-primary rounded-[20px]">
      <NavbarTitle title="Communication Room" override/>
      {/* Main video area */}
      <div className="relative flex flex-1 overflow-hidden">
        {screenSharing ? (
          // Screen share layout: screen big, cameras in sidebar
          <>
            {/* Screen stream — main area */}
            <div className="flex-1 p-3">
              <VideoTile stream={screenStream} userName={`${userName}'s screen`} muted />
            </div>

            {/* Camera sidebar */}
            <div className="flex w-52 flex-col gap-2 overflow-y-auto p-3">
              <VideoTile stream={localStream} userName={userName} muted small />
              {remotes.map((r) => (
                <VideoTile key={r.peerId} stream={r.stream} userName={r.userName} small />
              ))}
            </div>
          </>
        ) : (
          // Normal layout: grid of all participants
          <div
            className={`grid flex-1 gap-3 p-4 ${remotes.length === 0
                ? "grid-cols-1"
                : remotes.length === 1
                  ? "grid-cols-2"
                  : remotes.length <= 3
                    ? "grid-cols-2"
                    : "grid-cols-3"
              }`}
          >
            <VideoTile stream={localStream} userName={`${userName} (you)`} muted />
            {remotes.map((r) => (
              <VideoTile key={r.peerId} stream={r.stream} userName={r.userName} />
            ))}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex justify-center border-t border-white/10 px-6 py-4">
        <MeetingToolbar
          micOn={micOn}
          camOn={camOn}
          screenSharing={screenSharing}
          raiseHand={handRaised}
          onToggleMic={handleToggleMic}
          onToggleCam={handleToggleCam}
          onToggleScreen={handleToggleScreen}
          onToggleRaiseHand={handleToggleRaiseHand}
          onLeave={handleLeave}
        />
      </div>
    </div>
  );
}
