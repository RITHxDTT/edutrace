"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessageResponse } from "@/types/messageRespone";

interface ChatMessageListProps {
  messages: ChatMessageResponse[];
  currentUserId: string;
  hasMore: boolean;
  onLoadMore: () => void;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type BubblePosition = "single" | "first" | "middle" | "last";

function getBubblePosition(
  messages: ChatMessageResponse[],
  index: number,
): BubblePosition {
  const msg = messages[index];
  const prev = messages[index - 1];
  const next = messages[index + 1];

  const isFirst =
    !prev ||
    prev.senderUserId !== msg.senderUserId ||
    new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() >
      120_000;
  const isLast =
    !next ||
    next.senderUserId !== msg.senderUserId ||
    new Date(next.createdAt).getTime() - new Date(msg.createdAt).getTime() >
      120_000;

  if (isFirst && isLast) return "single";
  if (isFirst) return "first";
  if (isLast) return "last";
  return "middle";
}

function bubbleCorners(position: BubblePosition, isMe: boolean): string {
  if (isMe) {
    switch (position) {
      case "single":
        return "rounded-2xl";
      case "first":
        return "rounded-2xl rounded-br-[4px]";
      case "middle":
        return "rounded-l-2xl rounded-r-[4px]";
      case "last":
        return "rounded-2xl rounded-tr-[4px]";
    }
  }
  switch (position) {
    case "single":
      return "rounded-2xl";
    case "first":
      return "rounded-2xl rounded-bl-[4px]";
    case "middle":
      return "rounded-r-2xl rounded-l-[4px]";
    case "last":
      return "rounded-2xl rounded-tl-[4px]";
  }
}

export default function ChatMessageList({
  messages,
  currentUserId,
  hasMore,
  onLoadMore,
}: ChatMessageListProps) {
  const visibleMessages = useMemo(
    () =>
      Array.from(
        new Map(messages.map((message) => [message.chatMessageId, message]))
          .values(),
      ),
    [messages],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const prevScrollHeightRef = useRef<number | null>(null);
  const loadingRef = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const initialScrollDoneRef = useRef(false);
  const lastMessageIdRef = useRef<string | null>(null);
  const soundInitializedRef = useRef(false);

  // Play notification sound when a new message from another user arrives
  useEffect(() => {
    const lastMsg = visibleMessages[visibleMessages.length - 1];
    if (!lastMsg) return;

    if (!soundInitializedRef.current) {
      lastMessageIdRef.current = lastMsg.chatMessageId;
      soundInitializedRef.current = true;
      return;
    }

    if (lastMsg.chatMessageId !== lastMessageIdRef.current) {
      lastMessageIdRef.current = lastMsg.chatMessageId;
      if (lastMsg.senderUserId !== currentUserId) {
        const audio = new Audio("/audios/soundeffects/meet-message-sound-1.mp3");
        audio.play().catch(() => {});
      }
    }
  }, [visibleMessages, currentUserId]);

  // Initial scroll to bottom
  useEffect(() => {
    if (visibleMessages.length > 0 && !initialScrollDoneRef.current) {
      endRef.current?.scrollIntoView();
      initialScrollDoneRef.current = true;
    }
  }, [visibleMessages.length]);

  // Handle scroll position after messages change
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !initialScrollDoneRef.current) return;

    if (prevScrollHeightRef.current !== null) {
      el.scrollTop += el.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = null;
      loadingRef.current = false;
      setIsLoadingMore(false);
    } else if (isNearBottomRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleMessages]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    isNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingRef.current) return;
    loadingRef.current = true;
    setIsLoadingMore(true);
    prevScrollHeightRef.current =
      containerRef.current?.scrollHeight ?? 0;
    try {
      await onLoadMore();
    } finally {
      setTimeout(() => {
        loadingRef.current = false;
        setIsLoadingMore(false);
      }, 100);
    }
  }, [hasMore, onLoadMore]);

  // IntersectionObserver for infinite scroll at the top
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          handleLoadMore();
        }
      },
      { root: container, threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, handleLoadMore]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20"
    >
      <div ref={sentinelRef} className="h-1" />

      {isLoadingMore && (
        <div className="flex justify-center py-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
        </div>
      )}

      {visibleMessages.length === 0 && !isLoadingMore && (
        <div className="flex h-full items-center justify-center text-sm text-white/40">
          No messages yet
        </div>
      )}

      {visibleMessages.map((msg, i) => {
        const isMe = msg.senderUserId === currentUserId;
        const position = getBubblePosition(visibleMessages, i);
        const isFirst = position === "first" || position === "single";
        const isLast = position === "last" || position === "single";
        const senderName = `${msg.senderFirstName} ${msg.senderLastName}`;

        const avatarSize = "h-7 w-7";
        const showAvatar = !isMe && isLast;
        const avatarSpacer = !isMe && !isLast;

        return (
          <div
            key={msg.chatMessageId}
            className={`flex ${isMe ? "justify-end" : "justify-start"} ${
              isFirst ? "mt-3" : "mt-[3px]"
            }`}
          >
            <div
              className={`flex items-end gap-2 max-w-[75%] ${
                isMe ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar column */}
              {!isMe && (
                <div className={`${avatarSize} flex-shrink-0`}>
                  {showAvatar &&
                    (msg.senderProfileImage ? (
                      <img
                        src={msg.senderProfileImage}
                        alt={senderName}
                        className={`${avatarSize} rounded-full object-cover`}
                      />
                    ) : (
                      <div
                        className={`flex ${avatarSize} items-center justify-center rounded-full bg-gradient-to-br from-[#241cab] to-[#5d53f9] text-[10px] font-bold text-white`}
                      >
                        {msg.senderFirstName.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  {avatarSpacer && <div className={avatarSize} />}
                </div>
              )}

              {/* Message content */}
              <div className={isMe ? "flex flex-col items-end" : ""}>
                {isFirst && !isMe && (
                  <p className="mb-0.5 ml-1 text-[11px] font-medium text-white/50">
                    {senderName}
                  </p>
                )}

                <div
                  className={`px-3 py-2 text-[13px] leading-relaxed ${bubbleCorners(position, isMe)} ${
                    isMe
                      ? "bg-gradient-to-br from-[#241cab] to-[#5d53f9] text-white w-fit"
                      : "bg-white/10 text-white w-fit"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>

                {isLast && (
                  <p
                    className={`mt-0.5 text-[10px] text-white/40 ${
                      isMe ? "mr-1" : "ml-1"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={endRef} />
    </div>
  );
}
