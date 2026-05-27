'use client';

import React, { useState } from 'react';
import VideoCallInterface from './VideoCallInterface';
import ButtonBar from './ButtonBar';
import ChatSidebar from './ChatSideBar';
import { Participant } from '../../../../../../types/Participant'; 
import {ChatMessageResponse} from '../../../../../../types/messageRespone';

interface VideoCallPageProps {
  initialParticipants: Participant[];
}

export default function VideoCallPage({ initialParticipants }: VideoCallPageProps) {
  const [isCamOn, setIsCamOn] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false); 
  
  const [participants] = useState<Participant[]>(initialParticipants);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([
    {
      chatMessageId: "1",
      content: "Hello team! Can everyone hear me clearly?",
      senderUserId: "user-uuid-1",
      senderUsername: "vuththana",
      senderFirstName: "Keo",
      senderLastName: "Vuththana",
      senderProfileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      mentionUsers: [],
      createdAt: new Date().toISOString()
    }
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessageResponse = {
      chatMessageId: crypto.randomUUID(),
      content: text,
      senderUserId: "my-local-user-id",
      senderUsername: "yungbunnarith",
      senderFirstName: "Yung",
      senderLastName: "Bunnarith",
      senderProfileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      mentionUsers: [],
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-[650px] w-full bg-slate-50 p-6 font-sans select-none overflow-hidden">
      
      {/* Workspace Area split dynamically with the Chat Sidebar */}
      <div className="flex flex-1 gap-4 min-h-0 items-stretch">
        <div className="flex-[3] flex flex-col min-h-0">
          <VideoCallInterface 
            isCamOn={isCamOn} 
            isScreenSharing={isScreenSharing}
            setIsScreenSharing={setIsScreenSharing}
            participants={participants}
          />
        </div>

       
        <ChatSidebar 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
      
      {/* 2. Control Bar */}
      <ButtonBar 
        isCamOn={isCamOn} 
        setIsCamOn={setIsCamOn} 
        isScreenSharing={isScreenSharing}
        setIsScreenSharing={setIsScreenSharing}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
      />
      
    </div>
  );
}