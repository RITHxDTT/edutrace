'use client';

import React, { useState } from 'react';
import VideoCallInterface from './VideoCallInterface';
import ButtonBar from './ButtonBar';
import { participants as mockParticipants } from './User.mock'; 
import { Participant } from '../../../../../../types/Participant'; 
import { ScreenshareSvg } from './ScreenshareSvg';



export default function VideoCallPage() {
  
  const [isCamOn, setIsCamOn] = useState<boolean>(false);

  
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

  
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);

  return (
    <div className="mt-[-45px] mt-[-45px] flex flex-col h-[650px] w-[1100px] bg-slate-50 p-6 rounded-[20px] shadow-lg">
      
      {/* person present */}
      <div className="flex items-center gap-2 text-[18px] mb-4 py-4 w-full bg-[var(--text-color-border-default)] rounded-[20px] px-4">
        <ScreenshareSvg />  
        <span>Guest is presenting</span>
      </div>
      
      {/* participants */}
      <VideoCallInterface 
        isCamOn={isCamOn} 
        isScreenSharing={isScreenSharing}
        setIsScreenSharing={setIsScreenSharing}
        participants={participants}
      />
      
      {/* 2. Control Bar */}
      <ButtonBar 
        isCamOn={isCamOn} 
        setIsCamOn={setIsCamOn} 
        isScreenSharing={isScreenSharing}
        setIsScreenSharing={setIsScreenSharing}
      />
      
    </div>
  );
}