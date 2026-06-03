"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { ChatMessageResponse } from "@/types/messageRespone";
import { searchChatMessages } from "@/services/chat.service";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

interface ChatPanelProps {
  messages: ChatMessageResponse[];
  currentUserId: string;
  hasMore: boolean;
  isConnected: boolean;
  meetingRoomId: string;
  accessToken: string;
  onLoadMore: () => void;
  onSend: (content: string) => void;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPanel({
  messages,
  currentUserId,
  hasMore,
  isConnected,
  meetingRoomId,
  accessToken,
  onLoadMore,
  onSend,
}: ChatPanelProps) {
  const toggleChatPanel = useMeetingRoomStore((s) => s.toggleChatPanel);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatMessageResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchChatMessages(meetingRoomId, query, accessToken);
        setSearchResults(
          Array.from(
            new Map(
              results.map((message) => [message.chatMessageId, message]),
            ).values(),
          ),
        );
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [meetingRoomId, accessToken],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(searchQuery), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, doSearch]);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }

  return (
    <div className="flex min-w-[360px] w-[360px] flex-col border-l border-gray-200 bg-white h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Meeting Chat</h3>
          {!isConnected && (
            <p className="text-[10px] text-yellow-600">Connecting...</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Search size={14} />
          </button>
          <button
            onClick={toggleChatPanel}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {searchOpen && searchQuery.trim() ? (
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-400">
              No messages found
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {searchResults.map((msg) => {
                const isMe = msg.senderUserId === currentUserId;
                return (
                  <div
                    key={msg.chatMessageId}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.senderProfileImage ? (
                        <img
                          src={msg.senderProfileImage}
                          alt=""
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#241cab] to-[#5d53f9] text-[8px] font-bold text-white">
                          {msg.senderFirstName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs font-medium text-gray-700">
                        {isMe
                          ? "You"
                          : `${msg.senderFirstName} ${msg.senderLastName}`}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-auto">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 ml-7">
                      {msg.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <ChatMessageList
          messages={messages}
          currentUserId={currentUserId}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
        />
      )}

      {/* Input */}
      {(!searchOpen || !searchQuery.trim()) && (
        <ChatInput onSend={onSend} disabled={!isConnected} />
      )}
    </div>
  );
}
