"use client";

import type { ChatMessageResponse } from "@/types/messageRespone";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

interface ChatPanelProps {
  messages: ChatMessageResponse[];
  currentUserId: string;
  hasMore: boolean;
  isConnected: boolean;
  onLoadMore: () => void;
  onSend: (content: string) => void;
}

export default function ChatPanel({
  messages,
  currentUserId,
  hasMore,
  isConnected,
  onLoadMore,
  onSend,
}: ChatPanelProps) {
  const toggleChatPanel = useMeetingRoomStore((s) => s.toggleChatPanel);

  return (
    <div className="flex min-w-[360px] w-[360px] flex-col border-l border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Meeting Chat</h3>
          {!isConnected && (
            <p className="text-[10px] text-yellow-600">Connecting...</p>
          )}
        </div>
        <button
          onClick={toggleChatPanel}
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
      />

      <ChatInput onSend={onSend} disabled={!isConnected} />
    </div>
  );
}
