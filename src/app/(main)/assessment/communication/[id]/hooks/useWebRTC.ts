"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import type {
  PeerEventResponse,
  PeerInfo,
  RemoteParticipant,
} from "@/types/meeting-room";
import { registerPeer, unregisterPeer } from "@/services/meeting-room.service";
import { getMeetingRoomStompBrokerUrl } from "@/lib/meeting-room-stomp";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";

interface LocalMediaState {
  micOn: boolean;
  camOn: boolean;
  screenSharing: boolean;
  handRaised: boolean;
}

interface MediaStateMessage extends LocalMediaState {
  peerId: string;
  userId: string;
  userName: string;
}

interface PeerDataMessage {
  type: "media-state";
  payload: MediaStateMessage;
}

interface UseWebRTCOptions {
  meetingRoomId: string;
  userName: string;
  userId: string;
  accessToken: string;
  profileImageUrl?: string;
  initialCamOn?: boolean;
  initialMicOn?: boolean;
}

function getMediaStateDestination(meetingRoomId: string) {
  return `/topic/meeting-room/${meetingRoomId}/media-state`;
}

type CallMetadata = {
  userId?: string;
  userName?: string;
  profileImageUrl?: string;
  mediaState?: Partial<LocalMediaState>;
  isScreenShare?: boolean;
};

type PeerMediaConnection = import("peerjs").MediaConnection & {
  peerConnection?: RTCPeerConnection;
};

// Static fallback ICE servers used when the Cloudflare TURN credential fetch fails.
// OpenRelay is a free public TURN service with non-expiring credentials on ports
// 80/443 that pass through virtually every firewall and NAT.
const FALLBACK_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:openrelay.metered.ca:80" },
  {
    urls: "turn:openrelay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  {
    urls: "turn:openrelay.metered.ca:443",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  // TURNS on 443 — penetrates firewalls that only allow HTTPS traffic.
  {
    urls: "turns:openrelay.metered.ca:443",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
];

// Fetches short-lived Cloudflare TURN credentials from our server-side API route,
// which keeps CLOUDFLARE_TURN_API_TOKEN out of the browser bundle.
// Falls back to FALLBACK_ICE_SERVERS if the route is unreachable or unconfigured.
async function fetchIceServers(): Promise<RTCIceServer[]> {
  try {
    const res = await fetch("/api/turn-credentials");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { iceServers } = (await res.json()) as { iceServers: RTCIceServer[] };
    return iceServers;
  } catch (err) {
    console.warn(
      "[useWebRTC] Cloudflare TURN fetch failed, falling back to OpenRelay:",
      err,
    );
    return FALLBACK_ICE_SERVERS;
  }
}

async function getInitialLocalStream(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch {
    const stream = new MediaStream();

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoStream.getTracks().forEach((track) => stream.addTrack(track));
    } catch {
      // Camera is optional; a placeholder video sender is added below.
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioStream.getTracks().forEach((track) => stream.addTrack(track));
    } catch {
      // Microphone is optional.
    }

    return stream;
  }
}

// FIX 2: Return MediaStreamTrack (non-nullable) instead of MediaStreamTrack | null.
// HTMLCanvasElement.captureStream() always produces a CanvasCaptureMediaStreamTrack
// in every browser that supports WebRTC, so the null branch never fires in practice.
// Making the return type non-nullable removes the optional-chaining guard in the
// caller and ensures the placeholder is unconditionally added to the stream.
function createPlaceholderVideoTrack(): MediaStreamTrack {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 9;

  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#111827";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const stream = canvas.captureStream(1);
  return stream.getVideoTracks()[0];
}

function getCallPeerConnection(
  call: import("peerjs").MediaConnection,
): RTCPeerConnection | undefined {
  return (call as PeerMediaConnection).peerConnection;
}

// FIX 3: ICE connection state logging.
// Attaches listeners to the underlying RTCPeerConnection so every state transition
// is visible in the browser console. This lets you pinpoint exactly where the
// cross-network handshake stalls (e.g. "checking" → stuck means TURN is failing;
// "failed" means no relay path was found at all).
// Deferred one tick so PeerJS has time to assign .peerConnection after call()/answer().
function attachIceLogging(
  call: import("peerjs").MediaConnection,
  direction: "outgoing" | "incoming",
) {
  setTimeout(() => {
    const pc = getCallPeerConnection(call);
    if (!pc) {
      console.warn(
        `[WebRTC][${direction}] RTCPeerConnection not found for peer`,
        call.peer,
      );
      return;
    }

    const tag = `[WebRTC][${direction}↔${call.peer}]`;

    pc.addEventListener("icecandidateerror", (e) => {
      const err = e as RTCPeerConnectionIceErrorEvent;
      console.warn(
        tag,
        "ICE candidate error:",
        err.errorCode,
        err.errorText,
        "url:",
        err.url,
      );
    });
  }, 0);
}

export function useWebRTC({
  meetingRoomId,
  userName,
  userId,
  accessToken,
  profileImageUrl,
  initialCamOn,
  initialMicOn,
}: UseWebRTCOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [remotes, setRemotes] = useState<RemoteParticipant[]>([]);

  const peerRef = useRef<import("peerjs").Peer | null>(null);
  const stompRef = useRef<Client | null>(null);
  const dataConnectionsRef = useRef<
    Map<string, import("peerjs").DataConnection>
  >(new Map());
  const callsRef = useRef<Map<string, import("peerjs").MediaConnection>>(
    new Map(),
  );
  // Separate calls carrying only the screen track, keyed by remote peerId.
  const screenCallsRef = useRef<Map<string, import("peerjs").MediaConnection>>(
    new Map(),
  );
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const placeholderVideoTrackRef = useRef<MediaStreamTrack | null>(null);
  const myPeerIdRef = useRef<string>("");
  const joinedRef = useRef(false);
  const mediaStateRef = useRef<LocalMediaState>({
    micOn: true,
    camOn: true,
    screenSharing: false,
    handRaised: false,
  });

  const store = useMeetingRoomStore;

  const applyRemoteMediaState = useCallback((state: MediaStateMessage) => {
    setRemotes((prev) => {
      const idx = prev.findIndex(
        (r) =>
          r.peerId === state.peerId ||
          (state.userId && r.userId === state.userId),
      );

      if (idx === -1) {
        return [
          ...prev,
          {
            peerId: state.peerId,
            userId: state.userId,
            userName: state.userName,
            stream: null,
            isMuted: !state.micOn,
            isCamOff: !state.camOn,
            isHandRaised: state.handRaised,
            isScreenSharing: state.screenSharing,
          },
        ];
      }

      const next = [...prev];
      next[idx] = {
        ...next[idx],
        peerId: state.peerId,
        userId: state.userId || next[idx].userId,
        userName: state.userName || next[idx].userName,
        isMuted: !state.micOn,
        isCamOff: !state.camOn,
        isHandRaised: state.handRaised,
        isScreenSharing: state.screenSharing,
      };
      return next;
    });
  }, []);

  const buildMediaStateMessage = useCallback((): MediaStateMessage | null => {
    const peerId = myPeerIdRef.current;
    if (!peerId) return null;

    return {
      peerId,
      userId,
      userName,
      ...mediaStateRef.current,
    };
  }, [userId, userName]);

  const publishMediaState = useCallback(
    (payload: MediaStateMessage) => {
      const stomp = stompRef.current;
      if (!stomp?.connected) return;

      stomp.publish({
        destination: getMediaStateDestination(meetingRoomId),
        body: JSON.stringify(payload),
      });
    },
    [meetingRoomId],
  );

  const sendMediaState = useCallback(
    (
      connection: import("peerjs").DataConnection,
      payload = buildMediaStateMessage(),
    ) => {
      if (!payload || !connection.open) return;

      connection.send({
        type: "media-state",
        payload,
      } satisfies PeerDataMessage);
    },
    [buildMediaStateMessage],
  );

  const broadcastMediaState = useCallback(() => {
    const payload = buildMediaStateMessage();
    if (!payload) return;

    dataConnectionsRef.current.forEach((connection) => {
      sendMediaState(connection, payload);
    });
    publishMediaState(payload);
  }, [buildMediaStateMessage, publishMediaState, sendMediaState]);

  const addDataConnection = useCallback(
    (connection: import("peerjs").DataConnection) => {
      const existing = dataConnectionsRef.current.get(connection.peer);
      if (existing?.open && existing !== connection) {
        connection.close();
        sendMediaState(existing);
        return;
      }

      if (existing && existing !== connection) {
        existing.close();
      }

      dataConnectionsRef.current.set(connection.peer, connection);

      connection.on("open", () => {
        sendMediaState(connection);
      });

      connection.on("data", (data) => {
        if (
          typeof data === "object" &&
          data !== null &&
          "type" in data &&
          data.type === "media-state" &&
          "payload" in data
        ) {
          applyRemoteMediaState(data.payload as MediaStateMessage);
        }
      });

      connection.on("close", () => {
        if (dataConnectionsRef.current.get(connection.peer) === connection) {
          dataConnectionsRef.current.delete(connection.peer);
        }
      });

      connection.on("error", () => {
        if (dataConnectionsRef.current.get(connection.peer) === connection) {
          dataConnectionsRef.current.delete(connection.peer);
        }
      });

      if (connection.open) {
        sendMediaState(connection);
      }
    },
    [applyRemoteMediaState, sendMediaState],
  );

  const connectDataPeer = useCallback(
    (peerId: string) => {
      const peer = peerRef.current;
      const myPeerId = myPeerIdRef.current;
      if (!peer || !myPeerId || peerId === myPeerId) return;

      const existing = dataConnectionsRef.current.get(peerId);
      if (existing) {
        if (existing.open) {
          sendMediaState(existing);
        }
        return;
      }

      if (myPeerId > peerId) {
        return;
      }

      const connection = peer.connect(peerId, {
        metadata: { userId, userName },
      });
      addDataConnection(connection);
    },
    [addDataConnection, sendMediaState, userId, userName],
  );

  const updateLocalMediaState = useCallback(
    (state: Partial<LocalMediaState>) => {
      mediaStateRef.current = { ...mediaStateRef.current, ...state };
      broadcastMediaState();
    },
    [broadcastMediaState],
  );

  const getLocalVideoTrack = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    return track && track.readyState === "live" ? track : null;
  }, []);

  const getOutgoingStream = useCallback(() => {
    const tracks: MediaStreamTrack[] = [];
    const localStream = localStreamRef.current;
    const localVideoTrack = localStream?.getVideoTracks()[0];

    if (localVideoTrack && localVideoTrack.readyState === "live") {
      tracks.push(localVideoTrack);
    }

    localStream?.getAudioTracks().forEach((track) => {
      if (track.readyState === "live") {
        tracks.push(track);
      }
    });

    return new MediaStream(tracks);
  }, []);

  // Replaces the camera sender's track (the first video sender) — used when
  // turning the camera on/off. The screen sender is separate and unaffected.
  const replaceCameraTrack = useCallback(
    (track: MediaStreamTrack | null) => {
      callsRef.current.forEach((call) => {
        const sender = getCallPeerConnection(call)
          ?.getSenders()
          .find((s) => s.track?.kind === "video");
        if (!sender) return;
        sender.replaceTrack(track).catch((err) => {
          console.warn("[useWebRTC] failed to replace camera track:", err);
        });
      });
    },
    [],
  );

  // Creates a dedicated PeerJS call carrying only the screen track to one peer.
  // Using a separate call avoids SDP renegotiation entirely — the camera call
  // stays untouched and the remote receives screenStream on a distinct call object.
  const callPeerForScreen = useCallback(
    (peerId: string) => {
      const peer = peerRef.current;
      const myPeerId = myPeerIdRef.current;
      const currentScreen = screenStreamRef.current;
      if (!peer || !myPeerId || !currentScreen || peerId === myPeerId) return;
      if (screenCallsRef.current.has(peerId)) return;

      const screenTrack = currentScreen.getVideoTracks()[0];
      if (!screenTrack || screenTrack.readyState !== "live") return;

      const call = peer.call(peerId, new MediaStream([screenTrack]), {
        metadata: { userId, userName, isScreenShare: true },
      });
      screenCallsRef.current.set(peerId, call);

      call.on("close", () => {
        if (screenCallsRef.current.get(peerId) === call) {
          screenCallsRef.current.delete(peerId);
        }
      });
      call.on("error", () => {
        if (screenCallsRef.current.get(peerId) === call) {
          screenCallsRef.current.delete(peerId);
        }
      });
    },
    [userId, userName],
  );

  const stopScreenShare = useCallback(() => {
    const currentScreen = screenStreamRef.current;
    if (!currentScreen) return;

    currentScreen.getVideoTracks().forEach((track) => {
      track.onended = null;
    });
    currentScreen.getTracks().forEach((track) => track.stop());
    screenStreamRef.current = null;

    // Close all dedicated screen calls and wipe screenStream from every remote.
    screenCallsRef.current.forEach((call) => call.close());
    screenCallsRef.current.clear();
    setRemotes((prev) => prev.map((r) => ({ ...r, screenStream: null })));

    setScreenStream(null);
    store.getState().setScreenSharing(false);
    updateLocalMediaState({ screenSharing: false });
  }, [store, updateLocalMediaState]);

  const callPeer = useCallback(
    (
      peerId: string,
      peerUserName: string,
      peerUserId?: string,
      peerProfileImageUrl?: string,
    ) => {
      if (!peerRef.current || peerId === myPeerIdRef.current) return;
      if (callsRef.current.has(peerId)) return;

      const stream = getOutgoingStream();

      // FIX 4: Explicit warning instead of silent early return.
      // 0 tracks means the placeholder track creation failed (extremely rare) AND
      // both camera and mic were denied. Log clearly so the developer can diagnose
      // via the browser console rather than wondering why the call never fires.
      if (stream.getTracks().length === 0) {
        console.warn(
          "[useWebRTC] callPeer aborted — outgoing stream has 0 tracks.",
          "Check that createPlaceholderVideoTrack() succeeded and media permissions.",
          "Target peer:",
          peerId,
        );
        return;
      }

      const call = peerRef.current.call(peerId, stream, {
        metadata: {
          userId,
          userName,
          profileImageUrl,
          mediaState: mediaStateRef.current,
        },
      });

      callsRef.current.set(peerId, call);
      // Attach ICE logging immediately after the call is created so we catch
      // every state transition from the very beginning of the handshake.
      attachIceLogging(call, "outgoing");

      call.on("stream", (remoteStream) => {
        setRemotes((prev) => {
          const idx = prev.findIndex((r) => r.peerId === peerId);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = {
              ...next[idx],
              userId: peerUserId ?? next[idx].userId,
              userName: peerUserName || next[idx].userName,
              profileImageUrl: peerProfileImageUrl ?? next[idx].profileImageUrl,
              stream: remoteStream,
            };
            return next;
          }
          return [
            ...prev,
            {
              peerId,
              userId: peerUserId,
              userName: peerUserName,
              profileImageUrl: peerProfileImageUrl,
              stream: remoteStream,
            },
          ];
        });
      });

      call.on("close", () => {
        if (callsRef.current.get(peerId) !== call) return;
        setRemotes((prev) => prev.filter((r) => r.peerId !== peerId));
        callsRef.current.delete(peerId);
      });

      call.on("error", (err) => {
        console.warn("[useWebRTC] outgoing call error:", err);
        if (callsRef.current.get(peerId) === call) {
          callsRef.current.delete(peerId);
        }
      });
    },
    [getOutgoingStream, profileImageUrl, userId, userName],
  );

  useEffect(() => {
    let peer: import("peerjs").Peer;
    let stomp: Client;
    let mounted = true;
    const calls = callsRef.current;
    const dataConnections = dataConnectionsRef.current;
    const pendingFallbacks = new Map<string, ReturnType<typeof setTimeout>>();

    async function init() {
      if (!accessToken) return;

      const stream = await getInitialLocalStream();
      const hasCameraVideo = stream.getVideoTracks().length > 0;

      // FIX 2 (cont.): createPlaceholderVideoTrack() now returns a guaranteed
      // non-null track, so the conditional guard is gone. The placeholder is
      // unconditionally stored and added, ensuring getOutgoingStream() always
      // returns at least one video track before the first peer connection.
      if (!hasCameraVideo) {
        const placeholderTrack = createPlaceholderVideoTrack();
        placeholderVideoTrackRef.current = placeholderTrack;
        stream.addTrack(placeholderTrack);
      }

      if (!mounted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      localStreamRef.current = stream;
      setLocalStream(stream);

      const hasAudio = stream.getAudioTracks().length > 0;

      // Apply the user's pre-join preference captured in the lobby.
      // Tracks are disabled here rather than stopped so toggleCam/toggleMic
      // can re-enable them without requesting a new getUserMedia.
      const wantCam = initialCamOn !== false;
      const wantMic = initialMicOn !== false;

      if (hasCameraVideo && !wantCam) {
        stream
          .getVideoTracks()
          .filter((t) => t !== placeholderVideoTrackRef.current)
          .forEach((t) => {
            t.enabled = false;
          });
      }
      if (hasAudio && !wantMic) {
        stream.getAudioTracks().forEach((t) => {
          t.enabled = false;
        });
      }

      mediaStateRef.current = {
        ...mediaStateRef.current,
        micOn: hasAudio && wantMic,
        camOn: hasCameraVideo && wantCam,
      };
      store.getState().setCamOn(hasCameraVideo && wantCam);
      store.getState().setMicOn(hasAudio && wantMic);

      // Fetch fresh Cloudflare TURN credentials once per room join.
      // These are short-lived (up to 24 h) and generated server-side so the
      // API token never reaches the browser.
      const iceServers = await fetchIceServers();

      const { Peer } = await import("peerjs");
      peer = new Peer({
        config: { iceServers },
      });
      peerRef.current = peer;

      peer.on("open", async (myPeerId) => {
        if (!mounted) return;
        myPeerIdRef.current = myPeerId;

        let existingPeers: PeerInfo[] = [];
        try {
          const presence = await registerPeer(
            meetingRoomId,
            myPeerId,
            accessToken,
          );
          joinedRef.current = true;
          existingPeers = presence.peers.filter((p) => p.peerId !== myPeerId);
        } catch (err) {
          console.warn("[useWebRTC] peer registration failed:", err);
        }

        existingPeers.forEach((p) => {
          callPeer(
            p.peerId,
            `${p.firstName} ${p.lastName}`,
            p.userId,
            p.profileImage,
          );
          connectDataPeer(p.peerId);
        });

        stomp = new Client({
          brokerURL: getMeetingRoomStompBrokerUrl(),
          connectHeaders: { Authorization: `Bearer ${accessToken}` },
          reconnectDelay: 5000,
          onConnect: () => {
            stomp.subscribe(
              getMediaStateDestination(meetingRoomId),
              (frame) => {
                if (!mounted) return;

                try {
                  const state = JSON.parse(frame.body) as MediaStateMessage;
                  if (state.peerId !== myPeerId) {
                    applyRemoteMediaState(state);
                  }
                } catch (err) {
                  console.warn("[useWebRTC] media state parse error:", err);
                }
              },
            );

            stomp.subscribe(
              `/topic/meeting-room/${meetingRoomId}/peers`,
              (frame) => {
                if (!mounted) return;
                const event = JSON.parse(frame.body) as PeerEventResponse;

                if (
                  event.type === "JOINED" &&
                  event.peer &&
                  event.peer.peerId !== myPeerId
                ) {
                  const newPeerId = event.peer!.peerId;
                  const newPeerName = `${event.peer!.firstName} ${event.peer!.lastName}`;
                  const newPeerUserId = event.peer!.userId;
                  const newPeerProfileImage = event.peer!.profileImage;

                  setRemotes((prev) => {
                    if (prev.some((r) => r.peerId === newPeerId)) {
                      return prev;
                    }

                    return [
                      ...prev,
                      {
                        peerId: newPeerId,
                        userName: newPeerName,
                        userId: newPeerUserId,
                        profileImageUrl: newPeerProfileImage,
                        stream: null,
                      },
                    ];
                  });

                  connectDataPeer(newPeerId);
                  broadcastMediaState();

                  // If we're currently screen sharing, send the screen to the new peer.
                  if (screenStreamRef.current) {
                    callPeerForScreen(newPeerId);
                  }

                  // Fallback: if the joining peer's call doesn't arrive
                  // within 3 seconds, call them from this side instead.
                  const fallbackTimer = setTimeout(() => {
                    pendingFallbacks.delete(newPeerId);
                    if (!mounted) return;
                    if (callsRef.current.has(newPeerId)) return;
                    if (localStreamRef.current) {
                      callPeer(
                        newPeerId,
                        newPeerName,
                        newPeerUserId,
                        newPeerProfileImage,
                      );
                    }
                  }, 3000);
                  pendingFallbacks.set(newPeerId, fallbackTimer);
                } else if (event.type === "LEFT" && event.peer) {
                  const leftPeerId = event.peer.peerId;
                  const fb = pendingFallbacks.get(leftPeerId);
                  if (fb) {
                    clearTimeout(fb);
                    pendingFallbacks.delete(leftPeerId);
                  }
                  callsRef.current.get(leftPeerId)?.close();
                  callsRef.current.delete(leftPeerId);
                  screenCallsRef.current.get(leftPeerId)?.close();
                  screenCallsRef.current.delete(leftPeerId);
                  dataConnectionsRef.current.get(leftPeerId)?.close();
                  dataConnectionsRef.current.delete(leftPeerId);
                  setRemotes((prev) =>
                    prev.filter((r) => r.peerId !== leftPeerId),
                  );
                }

                store.getState().setParticipantCount(event.activeCount);
              },
            );

            broadcastMediaState();
          },
        });

        stomp.activate();
        stompRef.current = stomp;
      });

      peer.on("error", (err) => {
        console.warn("[useWebRTC] PeerJS error:", err.type, err);
      });

      peer.on("disconnected", () => {
        if (mounted && peer && !peer.destroyed) {
          peer.reconnect();
        }
      });

      peer.on("connection", (connection) => {
        addDataConnection(connection);
      });

      peer.on("call", (call) => {
        const metadata = call.metadata as CallMetadata | undefined;

        // ── Dedicated screen-share call ────────────────────────────────────
        // Answer with an empty stream (we don't send anything back on this call).
        // Store the received stream as screenStream on the matching remote entry.
        if (metadata?.isScreenShare) {
          call.answer(new MediaStream());
          screenCallsRef.current.set(call.peer, call);

          call.on("stream", (screenStream) => {
            if (!mounted) return;
            setRemotes((prev) => {
              const idx = prev.findIndex(
                (r) =>
                  r.peerId === call.peer ||
                  (metadata.userId && r.userId === metadata.userId),
              );
              if (idx === -1) return prev;
              const next = [...prev];
              next[idx] = { ...next[idx], screenStream };
              return next;
            });
          });

          call.on("close", () => {
            if (screenCallsRef.current.get(call.peer) === call) {
              screenCallsRef.current.delete(call.peer);
            }
            if (!mounted) return;
            setRemotes((prev) => {
              const idx = prev.findIndex((r) => r.peerId === call.peer);
              if (idx === -1) return prev;
              const next = [...prev];
              next[idx] = { ...next[idx], screenStream: null };
              return next;
            });
          });

          return; // do not process as a regular camera call
        }

        // ── Regular camera call ────────────────────────────────────────────
        const callerName = metadata?.userName ?? "Unknown";
        const callerUserId = metadata?.userId;
        const callerProfileImageUrl = metadata?.profileImageUrl;
        const callerMediaState = metadata?.mediaState;
        const activeStream = getOutgoingStream();

        const existingCall = callsRef.current.get(call.peer);
        if (existingCall && existingCall !== call) {
          existingCall.close();
        }

        // Cancel the fallback timer since we received the call.
        const fb = pendingFallbacks.get(call.peer);
        if (fb) {
          clearTimeout(fb);
          pendingFallbacks.delete(call.peer);
        }

        call.answer(activeStream);
        callsRef.current.set(call.peer, call);
        attachIceLogging(call, "incoming");

        call.on("stream", (remoteStream) => {
          if (!mounted) return;
          setRemotes((prev) => {
            const idx = prev.findIndex(
              (r) =>
                r.peerId === call.peer ||
                (callerUserId && r.userId === callerUserId),
            );
            if (idx !== -1) {
              const next = [...prev];
              next[idx] = {
                ...next[idx],
                peerId: call.peer,
                userId: callerUserId ?? next[idx].userId,
                userName: callerName || next[idx].userName,
                profileImageUrl:
                  callerProfileImageUrl ?? next[idx].profileImageUrl,
                stream: remoteStream,
                isMuted:
                  callerMediaState?.micOn == null
                    ? next[idx].isMuted
                    : !callerMediaState.micOn,
                isCamOff:
                  callerMediaState?.camOn == null
                    ? next[idx].isCamOff
                    : !callerMediaState.camOn,
                isScreenSharing:
                  callerMediaState?.screenSharing ?? next[idx].isScreenSharing,
              };
              return next;
            }
            return [
              ...prev,
              {
                peerId: call.peer,
                userId: callerUserId,
                userName: callerName,
                profileImageUrl: callerProfileImageUrl,
                stream: remoteStream,
                isMuted:
                  callerMediaState?.micOn == null
                    ? undefined
                    : !callerMediaState.micOn,
                isCamOff:
                  callerMediaState?.camOn == null
                    ? undefined
                    : !callerMediaState.camOn,
                isScreenSharing: callerMediaState?.screenSharing,
              },
            ];
          });
        });

        call.on("close", () => {
          if (callsRef.current.get(call.peer) !== call) return;
          setRemotes((prev) => prev.filter((r) => r.peerId !== call.peer));
          callsRef.current.delete(call.peer);
        });

        call.on("error", (err) => {
          console.warn("[useWebRTC] incoming call error:", err);
          if (callsRef.current.get(call.peer) === call) {
            callsRef.current.delete(call.peer);
          }
        });
      });
    }

    // keepalive: true tells the browser to complete the request even when the tab
    // is closed — the useEffect cleanup async call gets killed before it finishes.
    const handleBeforeUnload = () => {
      if (!joinedRef.current || !myPeerIdRef.current) return;
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      fetch(`${apiBase}/meeting-room/${meetingRoomId}/peers/leave`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        keepalive: true,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    init();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      mounted = false;
      pendingFallbacks.forEach((timer) => clearTimeout(timer));
      pendingFallbacks.clear();
      stompRef.current?.deactivate();
      calls.forEach((c) => c.close());
      calls.clear();
      screenCallsRef.current.forEach((c) => c.close());
      screenCallsRef.current.clear();
      dataConnections.forEach((connection) => connection.close());
      dataConnections.clear();
      peerRef.current?.destroy();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      placeholderVideoTrackRef.current?.stop();
      placeholderVideoTrackRef.current = null;
      localStreamRef.current = null;
      setLocalStream(null);
      setScreenStream(null);

      if (joinedRef.current) {
        joinedRef.current = false;
        unregisterPeer(meetingRoomId, accessToken).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    meetingRoomId,
    userName,
    accessToken,
    addDataConnection,
    applyRemoteMediaState,
    broadcastMediaState,
    callPeer,
    callPeerForScreen,
    connectDataPeer,
    getOutgoingStream,
  ]);

  function toggleMic() {
    const stream = localStreamRef.current;
    if (!stream || stream.getAudioTracks().length === 0) return;
    const enabled = !stream.getAudioTracks()[0].enabled;
    stream.getAudioTracks().forEach((t) => {
      t.enabled = enabled;
    });
    store.getState().setMicOn(enabled);
    updateLocalMediaState({ micOn: enabled });
  }

  async function toggleCam() {
    const stream = localStreamRef.current;
    if (!stream) return;

    const placeholderTrack = placeholderVideoTrackRef.current;
    const cameraTracks = stream
      .getVideoTracks()
      .filter((track) => track !== placeholderTrack);
    const cameraTrack = cameraTracks.find(
      (track) => track.readyState === "live",
    );

    if (!cameraTrack) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoTrack = videoStream.getVideoTracks()[0];
        if (!videoTrack) return;

        if (placeholderTrack) {
          stream.removeTrack(placeholderTrack);
          placeholderTrack.stop();
          placeholderVideoTrackRef.current = null;
        }

        stream.addTrack(videoTrack);

        // Camera sender is always the first video sender — update it regardless
        // of whether screen sharing is active (screen has its own sender now).
        replaceCameraTrack(videoTrack);

        setLocalStream(new MediaStream(stream.getTracks()));
        store.getState().setCamOn(true);
        updateLocalMediaState({ camOn: true });
      } catch {
        // Camera permission denied
      }
      return;
    }

    const enabled = !cameraTrack.enabled;
    cameraTracks.forEach((t) => {
      t.enabled = enabled;
    });
    store.getState().setCamOn(enabled);
    updateLocalMediaState({ camOn: enabled });
  }

  async function toggleScreen() {
    if (screenStreamRef.current) {
      stopScreenShare();
    } else {
      try {
        const display = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        const screenTrack = display.getVideoTracks()[0];
        if (!screenTrack) {
          display.getTracks().forEach((track) => track.stop());
          return;
        }

        screenStreamRef.current = display;
        setScreenStream(display);
        store.getState().setScreenSharing(true);
        updateLocalMediaState({ screenSharing: true });

        // Open a dedicated screen-share call to every currently connected peer.
        callsRef.current.forEach((_, peerId) => callPeerForScreen(peerId));

        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch {
        // User cancelled
      }
    }
  }

  function toggleRaiseHand() {
    const newState = !store.getState().handRaised;
    store.getState().setHandRaised(newState);
    updateLocalMediaState({ handRaised: newState });
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
