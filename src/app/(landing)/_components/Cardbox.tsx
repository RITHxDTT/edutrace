"use client"
import React from 'react';


interface CardBoxItem {
  icon: string;
  title: string;
  desc: string;
}

interface CardBoxListProps {
  item: CardBoxItem;
}

export default function CardBoxList({ item }: CardBoxListProps) {
  if (!item) return null;

  return (
    <div className="bg-white p-6 rounded-[28px] shadow-[0px_4px_30px_rgba(0,0,0,0.03)] w-full max-w-[480px] min-h-[160px] flex items-center justify-center transition-all duration-300 hover:shadow-md">
      <div className="flex gap-5 items-start w-full">
        
        <div className="w-[64px] h-[64px] shrink-0 flex justify-center items-center bg-white rounded-[18px]">
          <img
            src={item.icon}
            alt={`${item.title} visual asset`}
            className="w-[32px] h-[32px] object-contain"
          />
        </div>

        <div className="flex-1 min-w-0 pt-0.5 text-left">
          <h5 className="font-bold text-[22px] text-textColor leading-none tracking-tight">
            {item.title}
          </h5>
          <p className="font-normal text-[14px] leading-[22px] text-textColor mt-2.5">
            {item.desc}
          </p>
        </div>

      </div>
    </div>
  );
}