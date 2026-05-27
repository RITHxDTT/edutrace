'use client';

import React, { useEffect, useRef } from 'react';
import { Microphone2,
  MicrophoneSlash, } from 'iconsax-react';
import { Participant } from '../../../../../../types/Participant'; 
import {participants} from './User.mock'; 
import { VideoCallInterfaceProps } from '../../../../../../types/VideoCallInterfaceProps';



export default function VideoCallInterface({ 
  isCamOn, 
  isScreenSharing, 
  setIsScreenSharing, 
  participants  
}: VideoCallInterfaceProps) {
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenRef = useRef<HTMLVideoElement | null>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Camera Logic
  useEffect(() => {
    async function toggleCamera() {
      if (isCamOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          camStreamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Error accessing camera: ", err);
        }
      } else {
        if (camStreamRef.current) {
          camStreamRef.current.getTracks().forEach(track => track.stop());
          camStreamRef.current = null;
        }
      }
    }
    toggleCamera();
  }, [isCamOn]);

  // Screen Share Logic
  useEffect(() => {
    async function toggleScreenShare() {
      if (isScreenSharing) {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = stream;
          if (screenRef.current) screenRef.current.srcObject = stream;

          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
          };
        } catch (err) {
          console.error("Error sharing screen: ", err);
          setIsScreenSharing(false);
        }
      } else {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }
      }
    }
    toggleScreenShare();
  }, [isScreenSharing, setIsScreenSharing]);

  const hasMainFocus = isCamOn || isScreenSharing;

  return (
    <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0 items-stretch ">
      
      {/* Main Workspace */}
      {hasMainFocus && (
        <div className="flex-[3] flex flex-col gap-4 ">
          {isScreenSharing && (
            <div className="relative flex-1 bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <video ref={screenRef} autoPlay playsInline className="w-full h-full object-contain" />
              <span className="absolute top-4 left-4 bg-slate-900/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">You are presenting</span>
            </div>
          )}

          {isCamOn && !isScreenSharing && (
            <div className="relative flex-1 bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            </div>
          )}
        </div>
      )}

      {/* Participants Sidebar */}
      <div className={` flex gap-4 content-start overflow-y-auto ${hasMainFocus ? 'flex-col flex-[1] min-w-[240px] max-w-[320px]' : 'flex-wrap flex-1 items-stretch'}`}>
        {isScreenSharing && isCamOn && (
          <div className="relative w-full h-[160px] shrink-0  rounded-2xl overflow-hidden border border-sky-200">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <span className="absolute bottom-2 left-2 text-xs text-white bg-black/40 px-2 py-0.5 rounded">You</span>
          </div>
        )}

        {participants.map((user: Participant) => (
          <div key={user.id} className={`relative flex flex-col items-center justify-center w-[330px] h-[190px] bg-blue border border-blue-100 rounded-2xl p-6 shadow-sm  transition-all ${hasMainFocus ? 'w-full h-[160px] shrink-0' : 'flex-grow basis-[calc(50%-1rem)] md:basis-[calc(33.333%-1rem)] lg:basis-[calc(25%-1rem)]'}`}>
            <span className="absolute top-4 left-4 text-xs font-medium text-ai">{user.name}</span>
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-400 bg-blur-100 flex items-center justify-center">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-4 right-4">
              {user.isMuted ? <MicrophoneSlash size={10} variant="Linear" color="currentColor" className="w-4 h-4 text-ai" /> : <Microphone2 size={10} variant="Linear" color="currentColor" className="w-4 h-4 text-main-linear" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}