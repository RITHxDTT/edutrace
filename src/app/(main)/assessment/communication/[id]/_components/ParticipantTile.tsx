import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface ParticipantProps {
  name: string;
  isLocal: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isSpeaking: boolean;
  avatarUrl?: string;
}

export const ParticipantTile: React.FC<ParticipantProps> = ({
  name,
  isLocal,
  isVideoOn,
  isAudioOn,
  isSpeaking,
  avatarUrl,
}) => {
  return (
    <div
      className={`relative aspect-video bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 border-2 ${
        isSpeaking ? 'border-green-500 scale-[1.02]' : 'border-transparent'
      }`}
    >
      {/* Video Element or Avatar Fallback */}
      {isVideoOn ? (
        <video
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
      )}

      {/* Bottom Info Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-md text-white text-sm select-none">
        <span className="truncate max-w-[80%] font-medium">
          {name} {isLocal && '(You)'}
        </span>
        
        {/* Audio Mute/Unmute Indicator */}
        <div className={`p-1 rounded-full ${!isAudioOn ? 'bg-red-500' : 'bg-transparent'}`}>
          {isAudioOn ? (
            <Mic className={`w-4 h-4 ${isSpeaking ? 'text-green-400 animate-pulse' : 'text-white'}`} />
          ) : (
            <MicOff className="w-4 h-4 text-white" />
          )}
        </div>
      </div>
    </div>
  );
};