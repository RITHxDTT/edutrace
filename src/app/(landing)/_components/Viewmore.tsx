import React from 'react'

interface ViewMoreProps {
  colors: string;
  border: string;
}

export default function Viewmore({ colors, border }: ViewMoreProps) {
  return (
    <div>
        <span className={`hover:cursor-pointer bg-white/20 backdrop-blur-md ${colors} text-xs px-4 py-2 rounded-[10px] border ${border}/20 text-[16px]`}>View More</span>
    </div>
  )
}