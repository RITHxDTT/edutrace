"use client";

import { useEffect, useRef } from "react";
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

function isSameGroup(
  current: ChatMessageResponse,
  prev: ChatMessageResponse | undefined,
): boolean {
  if (!prev) return false;
  if (current.senderUserId !== prev.senderUserId) return false;
  const diff =
    new Date(current.createdAt).getTime() -
    new Date(prev.createdAt).getTime();
  return diff < 120_000;
}

export default function ChatMessageList({
  messages,
  currentUserId,
  hasMore,
  onLoadMore,
}: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
    >
      {hasMore && (
        <button
          onClick={onLoadMore}
          className="mx-auto mb-3 block text-xs text-primary hover:underline"
        >
          Load earlier messages
        </button>
      )}

      {messages.map((msg, i) => {
        const isMe = msg.senderUserId === currentUserId;
        const grouped = isSameGroup(msg, messages[i - 1]);
        const senderName = `${msg.senderFirstName} ${msg.senderLastName}`;

        return (
          <div
            key={msg.chatMessageId}
            className={`flex ${isMe ? "justify-end" : "justify-start"} ${grouped ? "mt-0.5" : "mt-3"}`}
          >
            <div
              className={`flex items-end gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : ""}`}
            >
              {!isMe && !grouped && (
                msg.senderProfileImage ? (
                  <img
                    src={msg.senderProfileImage}
                    alt={senderName}
                    className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#241cab] to-[#5d53f9] text-[10px] font-bold text-white flex-shrink-0">
                    {msg.senderFirstName.charAt(0).toUpperCase()}
                  </div>
                )
              )}

              {!isMe && grouped && <div className="w-7 flex-shrink-0" />}

              <div>
                {!grouped && !isMe && (
                  <p className="mb-0.5 ml-1 text-[11px] font-medium text-gray-500">
                    {senderName}
                  </p>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 text-sm ${
                    isMe
                      ? "bg-gradient-to-br from-[#241cab] to-[#5d53f9] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
                {!grouped && (
                  <p
                    className={`mt-0.5 text-[10px] text-gray-400 ${isMe ? "text-right mr-1" : "ml-1"}`}
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
