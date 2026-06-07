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
  readOnly?: boolean;
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
  readOnly = false,
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
    if (!searchQuery.trim()) return;
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
    <div className={`flex h-full w-full flex-col bg-black/60 backdrop-blur-xl ${readOnly ? "" : "border-l border-white/10"}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Meeting Chat</h3>
          {!isConnected && !readOnly && (
            <p className="text-[10px] text-yellow-400">Connecting…</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Search size={14} />
          </button>
          {!readOnly && (
            <button
              onClick={toggleChatPanel}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <Search size={14} className="flex-shrink-0 text-white/40" />
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="text-white/40 hover:text-white/70"
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
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-white/40">
              No messages found
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {searchResults.map((msg) => {
                const isMe = msg.senderUserId === currentUserId;
                return (
                  <div
                    key={msg.chatMessageId}
                    className="px-4 py-3 transition-colors hover:bg-white/5"
                  >
                    <div className="mb-1 flex items-center gap-2">
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
                      <span className="text-xs font-medium text-white/80">
                        {isMe
                          ? "You"
                          : `${msg.senderFirstName} ${msg.senderLastName}`}
                      </span>
                      <span className="ml-auto text-[10px] text-white/40">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    <p className="ml-7 line-clamp-2 text-sm text-white/60">
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
      {!readOnly && (!searchOpen || !searchQuery.trim()) && (
        <ChatInput onSend={onSend} disabled={!isConnected} />
      )}
      {readOnly && (
        <div className="border-t border-white/10 px-4 py-3 text-center text-xs text-white/40">
          Messaging is disabled — this assessment is closed
        </div>
      )}
    </div>
  );
}
