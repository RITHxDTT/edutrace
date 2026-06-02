"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { RemoteParticipant } from "@/types/meeting-room";
import {
  joinMeetingRoom,
  leaveMeetingRoom,
  registerPeer,
  unregisterPeer,
} from "@/services/meeting-room.service";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";

interface UseWebRTCOptions {
  meetingRoomId: string;
  userName: string;
  accessToken: string;
}

export function useWebRTC({
  meetingRoomId,
  userName,
  accessToken,
}: UseWebRTCOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [remotes, setRemotes] = useState<RemoteParticipant[]>([]);

  const peerRef = useRef<import("peerjs").Peer | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const callsRef = useRef<Map<string, import("peerjs").MediaConnection>>(
    new Map(),
  );
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const store = useMeetingRoomStore;

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
          return [
            ...prev,
            { peerId, userName: peerUserName, stream: remoteStream },
          ];
        });
      });

      call.on("close", () => {
        setRemotes((prev) => prev.filter((r) => r.peerId !== peerId));
        callsRef.current.delete(peerId);
      });
    },
    [userName],
  );

  useEffect(() => {
    let peer: import("peerjs").Peer;
    let socket: Socket;
    let mounted = true;

    async function init() {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch {
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

      const hasVideo = stream.getVideoTracks().length > 0;
      const hasAudio = stream.getAudioTracks().length > 0;
      store.getState().setCamOn(hasVideo);
      store.getState().setMicOn(hasAudio);

      const { Peer } = await import("peerjs");
      peer = new Peer();
      peerRef.current = peer;

      peer.on("open", async (myPeerId) => {
        if (!mounted) return;

        try {
          await registerPeer(meetingRoomId, myPeerId, accessToken);
          await joinMeetingRoom(meetingRoomId, accessToken);
        } catch {
          // Backend may be unreachable — continue with Socket.IO signaling
        }

        socket = io();
        socketRef.current = socket;

        socket.emit("join-room", {
          roomId: meetingRoomId,
          peerId: myPeerId,
          userName,
        });

        socket.on(
          "existing-users",
          (users: { peerId: string; userName: string }[]) => {
            users.forEach(({ peerId, userName: peerName }) => {
              const activeStream =
                screenStreamRef.current ?? localStreamRef.current;
              if (activeStream) callPeer(peerId, peerName, activeStream);
            });
          },
        );

        socket.on(
          "user-joined",
          ({
            peerId,
            userName: peerName,
          }: {
            peerId: string;
            userName: string;
          }) => {
            setRemotes((prev) => {
              if (prev.find((r) => r.peerId === peerId)) return prev;
              return [
                ...prev,
                { peerId, userName: peerName, stream: null },
              ];
            });
          },
        );

        socket.on("user-left", ({ peerId }: { peerId: string }) => {
          callsRef.current.get(peerId)?.close();
          callsRef.current.delete(peerId);
          setRemotes((prev) => prev.filter((r) => r.peerId !== peerId));
        });

        socket.on(
          "raise-hand",
          ({
            peerId,
            raised,
          }: {
            peerId: string;
            userName: string;
            raised: boolean;
          }) => {
            setRemotes((prev) =>
              prev.map((r) =>
                r.peerId === peerId ? { ...r, isHandRaised: raised } : r,
              ),
            );
          },
        );
      });

      peer.on("call", (call) => {
        const callerName: string = call.metadata?.userName ?? "Unknown";
        const activeStream =
          screenStreamRef.current ?? localStreamRef.current ?? new MediaStream();
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
            return [
              ...prev,
              { peerId: call.peer, userName: callerName, stream: remoteStream },
            ];
          });
        });

        call.on("close", () => {
          setRemotes((prev) => prev.filter((r) => r.peerId !== call.peer));
          callsRef.current.delete(call.peer);
        });
      });
    }

    init();

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      callsRef.current.forEach((c) => c.close());
      callsRef.current.clear();
      peerRef.current?.destroy();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());

      unregisterPeer(meetingRoomId, accessToken).catch(() => {});
      leaveMeetingRoom(meetingRoomId, accessToken).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingRoomId, userName, accessToken]);

  function toggleMic() {
    const stream = localStreamRef.current;
    if (!stream || stream.getAudioTracks().length === 0) return;
    const enabled = !stream.getAudioTracks()[0].enabled;
    stream.getAudioTracks().forEach((t) => {
      t.enabled = enabled;
    });
    store.getState().setMicOn(enabled);
  }

  function toggleCam() {
    const stream = localStreamRef.current;
    if (!stream || stream.getVideoTracks().length === 0) return;
    const enabled = !stream.getVideoTracks()[0].enabled;
    stream.getVideoTracks().forEach((t) => {
      t.enabled = enabled;
    });
    store.getState().setCamOn(enabled);
  }

  async function toggleScreen() {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
      store.getState().setScreenSharing(false);

      const camStream = localStreamRef.current;
      if (camStream) {
        callsRef.current.forEach((call) => {
          const sender = (
            call as unknown as { peerConnection?: RTCPeerConnection }
          ).peerConnection
            ?.getSenders()
            .find((s) => s.track?.kind === "video");
          const videoTrack = camStream.getVideoTracks()[0];
          if (sender && videoTrack) sender.replaceTrack(videoTrack);
        });
      }
    } else {
      try {
        const display = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = display;
        setScreenStream(display);
        store.getState().setScreenSharing(true);

        callsRef.current.forEach((call) => {
          const sender = (
            call as unknown as { peerConnection?: RTCPeerConnection }
          ).peerConnection
            ?.getSenders()
            .find((s) => s.track?.kind === "video");
          const screenTrack = display.getVideoTracks()[0];
          if (sender && screenTrack) sender.replaceTrack(screenTrack);
        });

        display.getVideoTracks()[0].onended = () => {
          toggleScreen();
        };
      } catch {
        // User cancelled
      }
    }
  }

  function toggleRaiseHand() {
    const newState = !store.getState().handRaised;
    store.getState().setHandRaised(newState);
    socketRef.current?.emit("raise-hand", {
      roomId: meetingRoomId,
      raised: newState,
      userName,
    });
  }

  return {
    localStream,
    screenStream,
    remotes,
    toggleMic,
    toggleCam,
    toggleScreen,
    toggleRaiseHand,
  };
}
