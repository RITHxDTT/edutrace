"use client";

import React, { useState } from "react";
import {
  Microphone2,
  MicrophoneSlash,
  Video,
  VideoSlash,
  MirroringScreen,
  CallSlash,
  Profile2User,
  Messages2,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import { RaiseHand } from "./RaiseHandSvg";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";

interface ButtonBarProps {
  isCamOn: boolean;
  setIsCamOn: React.Dispatch<React.SetStateAction<boolean>>;
  isScreenSharing: boolean;
  setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  isChatOpen: boolean; 
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>; // Added missing prop
}

export default function ButtonBar({
  isCamOn,
  setIsCamOn,
  isScreenSharing,
  setIsScreenSharing,
  isChatOpen,
  setIsChatOpen,
}: ButtonBarProps) {
  const router = useRouter();
  const [isMicOn, setIsMicOn] = useState(false);

  return (
    <div className="mt-6 flex w-full shrink-0 items-center justify-between px-2">
      
      {/* left */}
      <div className="flex items-center gap-2 text-lg font-normal text-slate-700">
        <span>17:24</span>
        <span className="text-slate-300">|</span>
        <span className="font-medium">abc-def-ghi</span>
      </div>

      {/* action toggle */}
      <div className="flex items-center gap-3">

        {/* mic */}
        <PrimaryButton
          onClick={() => setIsMicOn(!isMicOn)}
          className={`rounded-full p-3.5 shadow-sm transition ${
            isMicOn
              ? "bg-accent-linear-purple text-white hover:opacity-90"
              : "bg-sky-50 text-ai hover:bg-sky-100"
          }`}
        >
          {isMicOn ? (
            <Microphone2 size={20} variant="Linear" color="currentColor" />
          ) : (
            <MicrophoneSlash
              size={20}
              variant="Linear"
              color="currentColor"
            />
          )}
        </PrimaryButton>

        {/* camera */}
        <PrimaryButton
          onClick={() => setIsCamOn(!isCamOn)}
          className={`rounded-full border p-3.5 shadow-sm transition ${
            isCamOn
              ? "border-accent-linear-purple bg-accent-linear-purple text-white"
              : "border-sky-100 bg-sky-50 text-ai hover:bg-sky-100"
          }`}
        >
          {isCamOn ? (
            <Video size={20} variant="Linear" color="currentColor" />
          ) : (
            <VideoSlash size={20} variant="Linear" color="currentColor" />
          )}
        </PrimaryButton>

        {/* screen share */}
        <PrimaryButton
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`rounded-full border p-3.5 shadow-sm transition ${
            isScreenSharing
              ? "border-accent-linear-purple bg-accent-linear-purple text-white"
              : "border-sky-100 bg-sky-50 text-ai hover:bg-sky-100"
          }`}
        >
          <MirroringScreen
            size={20}
            variant="Linear"
            color="currentColor"
          />
        </PrimaryButton>

        {/* raise hand */}
        <PrimaryButton className="rounded-full border border-sky-100 bg-sky-50 p-3.5 text-ai shadow-sm transition hover:bg-sky-100">
          <RaiseHand />
        </PrimaryButton>

        {/* leave call */}
        <PrimaryButton className="rounded-full bg-rose-600 px-6 py-3.5 text-white shadow-sm transition hover:bg-rose-700">
          <CallSlash size={20} variant="Linear" color="currentColor" />
        </PrimaryButton>
      </div>

      {/* utility action */}
      <div className="flex items-center gap-4 text-slate-500">
        
        <button className="transition hover:text-slate-800">
          <Profile2User
            size={24}
            variant="Linear"
            color="currentColor"
          />
        </button>

        {/* Integrated Chat Button Toggle */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`relative transition p-2 rounded-full ${
            isChatOpen ? 'text-accent-linear-purple bg-purple-50' : 'hover:text-main-linear'
          }`}
        >
          <Messages2
            size={24}
            variant="Linear"
            color="currentColor"
          />
          {!isChatOpen && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500"></span>
          )}
        </button>
      </div>
    </div>
  );
}