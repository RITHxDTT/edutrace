"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import type { ChatMessageResponse } from "@/types/messageRespone";
import {
  getChatMessages,
  sendChatMessage,
} from "@/services/chat.service";
import { getMeetingRoomStompBrokerUrl } from "@/lib/meeting-room-stomp";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";

const PAGE_SIZE = 30;

function dedupeMessages(messages: ChatMessageResponse[]) {
  const byId = new Map<string, ChatMessageResponse>();
  messages.forEach((message) => {
    byId.set(message.chatMessageId, message);
  });
  return Array.from(byId.values());
}

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
  const pageRef = useRef(1);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getChatMessages(meetingRoomId, accessToken, 1, PAGE_SIZE)
      .then((data) => {
        setMessages(dedupeMessages(data).reverse());
        setHasMore(data.length >= PAGE_SIZE);
        pageRef.current = 2;
      })
      .catch((err) => console.warn("[useStompChat] failed to load messages:", err));
  }, [meetingRoomId, accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const client = new Client({
      brokerURL: getMeetingRoomStompBrokerUrl(),
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
            setMessages((prev) => {
              if (prev.some((m) => m.chatMessageId === msg.chatMessageId)) {
                return prev;
              }

              return [...prev, msg];
            });

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
      PAGE_SIZE,
    );
    setMessages((prev) => dedupeMessages([...data.reverse(), ...prev]));
    setHasMore(data.length >= PAGE_SIZE);
    pageRef.current += 1;
  }, [meetingRoomId, accessToken, hasMore]);

  return { messages, sendMessage, loadMore, hasMore, isConnected };
}
