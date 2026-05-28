'use client';

import React, { useState } from 'react';
import VideoCallInterface from './VideoCallInterface';
import ButtonBar from './ButtonBar';

import { Participant } from '../../../../../../types/Participant';



interface ClientWrapperProps {
  initialParticipants: Participant[];
}

export default function VideoCallClientWrapper({ initialParticipants }: ClientWrapperProps) {
  const [isCamOn, setIsCamOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <VideoCallInterface
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        setIsScreenSharing={setIsScreenSharing}
        participants={initialParticipants}
      />

      <ButtonBar
        isCamOn={isCamOn}
        setIsCamOn={setIsCamOn}
        isScreenSharing={isScreenSharing}
        setIsScreenSharing={setIsScreenSharing}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
      />
    </>
  );
}