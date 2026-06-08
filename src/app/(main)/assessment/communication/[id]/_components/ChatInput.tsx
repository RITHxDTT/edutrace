"use client";

import { useState, useRef, useCallback } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, onSend]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  return (
    <div className="flex items-end gap-2 border-t border-white/10 p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Type a message…"
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
