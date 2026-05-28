'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CloseSquare, Send2 } from 'iconsax-react';
import { ChatMessageResponse } from '../../../../../../types/messageRespone';
import { useSession } from 'next-auth/react';


interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageResponse[];
  onSendMessage: (text: string) => void;
}

export default function ChatSidebar({ isOpen, onClose, messages, onSendMessage }: ChatSidebarProps) {
  const [typedMessage, setTypedMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;



  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    onSendMessage(typedMessage);
    setTypedMessage('');
  };

  return (
    <div className="w-[340px] bg-white border border-slate-200 rounded-2xl flex flex-col h-full shadow-sm shrink-0">


      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">In-call messages</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
          <CloseSquare size={22} variant="Linear" />
        </button>
      </div>


      <div className="p-3 mx-4 mt-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 leading-relaxed">
        Messages can only be seen by people in the call and are deleted when the call ends.
      </div>


      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg) => {
          const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          const isMe = msg.senderUserId === currentUserId;

          return (
            <div
              key={msg.chatMessageId}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-2 max-w-[100%] ${isMe ? 'flex-row-reverse' : 'flex-row'
                  }`}
              >
                <img
                  src={msg.senderProfileImage}
                  alt={msg.senderFirstName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-100 mt-0.5"
                />

                <div
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'
                    }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-slate-700 truncate">
                      {msg.senderFirstName} {msg.senderLastName}
                    </span>

                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {formattedTime}
                    </span>
                  </div>

                  <p
                    className={`text-xs mt-1 break-words px-3 py-2 rounded-2xl shadow-sm ${isMe
                      ? 'bg-accent-linear-purple text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-700 rounded-bl-md'
                      }`}
                  >
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </div>


      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 flex gap-2 items-center bg-slate-50/50 rounded-b-2xl">
        <input
          type="text"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          placeholder="Send a message to everyone"
          className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-accent-linear-purple transition placeholder-slate-400 text-slate-700"
        />
        <button
          type="submit"
          disabled={!typedMessage.trim()}
          className={`p-2 rounded-full transition ${typedMessage.trim()
            ? 'bg-accent-linear-purple text-white hover:opacity-90 shadow-sm'
            : 'text-slate-300 bg-slate-100 cursor-not-allowed'
            }`}
        >
          <Send2 size={16} variant="Linear" color="currentColor" />
        </button>
      </form>

    </div>
  );
}