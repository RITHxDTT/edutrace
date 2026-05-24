import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="w-full h-[122px] bg-[#FBFBFD] border-b border-[#D9D9D9] flex items-center justify-between px-[74px] sticky top-0 z-[100]">
      
      <div className="flex items-center gap-[9px] w-[263px] h-[65px]">
        <div className="relative w-[60px] h-[65px]">
          <Image 
            src="/images/logo.png" 
            alt="GrowthFlow Logo" 
            fill 
            className="object-contain"
          />
        </div>
        <span className="font-['Fredoka'] font-medium text-[32px] text-black">
          GrowthFlow
        </span>
      </div>

      {/* Center Anchor Navigation links */}
      <div className="flex items-center gap-[51px]">
        <Link href="#how-it-works" className="font-['Fredoka'] font-normal text-[24px] text-[#444655] hover:text-[#241CAB] transition-colors">
          How It Works
        </Link>
        <Link href="#about" className="font-['Fredoka'] font-normal text-[24px] text-[#444655] hover:text-[#241CAB] transition-colors">
          About
        </Link>
      </div>

      {/* Gateway Call To Actions */}
      <div className="flex items-center gap-[19px]">
        <button className="w-[138px] h-[45px] font-['Fredoka'] font-medium text-[24px] text-[#444655] hover:opacity-80">
          Register
        </button>
        <button className="w-[102px] h-[43px] bg-gradient-to-r from-[#4F6BFF] to-[#7B61FF] text-white font-['Fredoka'] font-medium text-[24px] rounded-lg shadow-[0px_10px_20px_rgba(79,107,255,0.2)] hover:brightness-110 transition-all">
          Login
        </button>
      </div>
    </nav>
  );
}