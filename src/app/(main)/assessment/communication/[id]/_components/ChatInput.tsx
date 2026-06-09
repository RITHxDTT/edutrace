"use client";

import { useState, useRef, useCallback } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

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
    <div className="flex items-end gap-2 border-t border-gray-200 p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-[#241cab] to-[#5d53f9] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  );
}
