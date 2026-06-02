"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import type { ChatMessageResponse } from "@/types/messageRespone";
import {
  getChatMessages,
  sendChatMessage,
} from "@/services/chat.service";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";

interface UseStompChatOptions {
  meetingRoomId: string;
  accessToken: string;
}

export function useStompChat({
  meetingRoomId,
  accessToken,
}: UseStompChatOptions) {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const pageRef = useRef(0);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    getChatMessages(meetingRoomId, accessToken, 0, 30)
      .then((data) => {
        setMessages(data.content.reverse());
        setHasMore(!data.last);
        pageRef.current = 1;
      })
      .catch(() => {});
  }, [meetingRoomId, accessToken]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    const wsUrl = apiBase.replace(/^http/, "ws") + "/ws-native";

    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);

        client.subscribe(
          `/topic/meeting-room/${meetingRoomId}/messages`,
          (frame) => {
            const msg = JSON.parse(frame.body) as ChatMessageResponse;
            setMessages((prev) => [...prev, msg]);

            const { chatPanelOpen } = useMeetingRoomStore.getState();
            if (!chatPanelOpen) {
              useMeetingRoomStore.getState().incrementUnread();
            }
          },
        );

        client.subscribe(
          `/topic/meeting-room/${meetingRoomId}/messages/delete`,
          (frame) => {
            const deletedId = JSON.parse(frame.body) as string;
            setMessages((prev) =>
              prev.filter((m) => m.chatMessageId !== deletedId),
            );
          },
        );

        client.subscribe(
          `/topic/meeting-room/${meetingRoomId}/messages/update`,
          (frame) => {
            const updated = JSON.parse(frame.body) as ChatMessageResponse;
            setMessages((prev) =>
              prev.map((m) =>
                m.chatMessageId === updated.chatMessageId ? updated : m,
              ),
            );
          },
        );
      },
      onDisconnect: () => setIsConnected(false),
      onStompError: () => setIsConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [meetingRoomId, accessToken]);

  const sendMessage = useCallback(
    async (content: string, mentionUserIds: string[] = []) => {
      await sendChatMessage(meetingRoomId, content, mentionUserIds, accessToken);
    },
    [meetingRoomId, accessToken],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    const data = await getChatMessages(
      meetingRoomId,
      accessToken,
      pageRef.current,
      30,
    );
    setMessages((prev) => [...data.content.reverse(), ...prev]);
    setHasMore(!data.last);
    pageRef.current += 1;
  }, [meetingRoomId, accessToken, hasMore]);

  return { messages, sendMessage, loadMore, hasMore, isConnected };
}
