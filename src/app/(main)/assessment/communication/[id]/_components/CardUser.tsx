import React from 'react'
import { Mic, MicOff } from "lucide-react";
import { participants } from './User.mock';

export default function CardUser() {
  return (
    <div className="w-full h-full flex flex-wrap gap-4 flex-1 items-stretch content-start overflow-y-auto">
        {participants.map((user) => (
          <div 
            key={user.id} 
            className="w-[335px] h-[195px] relative flex flex-col items-center justify-center bg-sky-50/50 border border-sky-100 rounded-2xl p-6 shadow-sm min-h-[140px] flex-grow basis-[calc(50%-1rem)] md:basis-[calc(33.333%-1rem)] lg:basis-[calc(25%-1rem)]"
          >

            <span className="absolute top-4 left-4 text-xs font-medium text-slate-600">
              {user.name}
            </span>

            {/* Centered Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-sky-400 bg-sky-100 flex items-center justify-center">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom-right Mic Status */}
            <div className="absolute bottom-4 right-4">
              {user.isMuted ? (
                <MicOff className="w-4 h-4 text-slate-500" />
              ) : (
                <Mic className="w-4 h-4 text-emerald-500" />
              )}
            </div>
          </div>
        ))}
      </div>
  )
}
