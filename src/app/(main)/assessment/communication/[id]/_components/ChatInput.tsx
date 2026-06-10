"use client";

import { useState, useRef, useCallback } from "react";
import { SendHorizontal } from "lucide-react";
import type { MeetingMember } from "@/types/meeting-room";

interface ChatInputProps {
  members: MeetingMember[];
  onSend: (content: string, mentionUserIds: string[]) => void;
}

function getDisplayName(m: MeetingMember) {
  return `${m.firstName} ${m.lastName}`;
}

function getMentionContext(
  text: string,
  cursorPos: number,
): { query: string; start: number } | null {
  const before = text.slice(0, cursorPos);
  const match = before.match(/@([^\s@]*)$/);
  if (!match) return null;
  return {
    query: match[1],
    start: cursorPos - match[0].length,
  };
}

function filterMembers(members: MeetingMember[], query: string) {
  if (!query) return members.slice(0, 6);
  const q = query.toLowerCase();
  return members
    .filter(
      (m) =>
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q),
    )
    .slice(0, 6);
}

export default function ChatInput({ members, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [mention, setMention] = useState<{
    query: string;
    start: number;
  } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // @FullName -> userId for members selected from the dropdown in this draft
  const mentionMapRef = useRef<Map<string, string>>(new Map());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filtered = mention ? filterMembers(members, mention.query) : [];

  const insertMention = useCallback(
    (member: MeetingMember) => {
      if (!mention) return;
      const tag = `@${getDisplayName(member)} `;
      const before = value.slice(0, mention.start);
      const after = value.slice(mention.start + 1 + mention.query.length);
      const next = before + tag + after;
      setValue(next);
      mentionMapRef.current.set(`@${getDisplayName(member)}`, member.userId);
      setMention(null);
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (!el) return;
        const pos = before.length + tag.length;
        el.focus();
        el.setSelectionRange(pos, pos);
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
      });
    },
    [value, mention],
  );

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const mentionUserIds: string[] = [];
    mentionMapRef.current.forEach((userId, tag) => {
      if (trimmed.includes(tag)) mentionUserIds.push(userId);
    });
    onSend(trimmed, mentionUserIds);
    setValue("");
    mentionMapRef.current.clear();
    setMention(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, onSend]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;
    const cursor = e.target.selectionStart ?? text.length;
    setValue(text);
    const ctx = getMentionContext(text, cursor);
    setMention(ctx);
    setActiveIndex(0);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (mention && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        insertMention(filtered[activeIndex]);
        return;
      }
      if (e.key === "Escape") {
        setMention(null);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleSelect(e: React.SyntheticEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const cursor = el.selectionStart ?? value.length;
    const ctx = getMentionContext(value, cursor);
    setMention(ctx);
    setActiveIndex(0);
  }

  return (
    <div className="relative flex items-end gap-2 border-t border-white/10 p-3">
      {/* Mention dropdown */}
      {mention && filtered.length > 0 && (
        <div className="absolute bottom-full left-3 right-3 mb-1 overflow-hidden rounded-lg border border-white/10 bg-[#16161f] shadow-xl">
          {filtered.map((member, i) => (
            <button
              key={member.userId}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insertMention(member);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                i === activeIndex ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              {member.profileImage ? (
                <img
                  src={member.profileImage}
                  alt=""
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#241cab] to-[#5d53f9] text-[11px] font-semibold text-white">
                  {member.firstName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {getDisplayName(member)}
                </p>
                <p className="truncate text-xs text-white/40">
                  @{member.username}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        placeholder="Message… use @ to mention"
        rows={1}
        className="flex-1 resize-none rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-[#241cab] to-[#5d53f9] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  );
}
