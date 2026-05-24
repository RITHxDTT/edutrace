import React from 'react';
import Image from 'next/image';
import ScanToLoginCard from './Cardqr';
import UserConnection from './UserConnected';

export default function Hero() {
  return (
    <section className="w-full flex flex-col items-center pt-16 px-[74px] gap-[70px]">
      
      {/* Headline Elements */}
      <div className="text-center max-w-[867px] flex flex-col gap-[35px]">
        <h1 className="font-['Fredoka'] font-medium text-[48px] leading-[58px] bg-gradient-to-r from-[#281FC1] to-[#6B6EE8] bg-clip-text text-transparent">
          Stay on track. Don’t miss tasks. Achieve more with confidence.
        </h1>
        <p className="font-['Fredoka'] font-normal text-[24px] leading-[29px] text-[#BABABA] max-w-[723px] mx-auto">
          Manage your tasks, get timely notifications, and stay connected with your instructors
        </p>
        
        {/* Call to action action button */}
        <button className="mx-auto flex items-center justify-between pl-6 pr-2 py-2 w-[181px] h-[61px] bg-gradient-to-b from-[#241CAB] to-[#5D53F9] rounded-[25px] shadow-md group hover:brightness-110 transition-all">
          <span className="font-['Fredoka'] font-medium text-[18px] text-white">Get Started</span>
          <div className="w-[51px] h-[51px] bg-white rounded-full flex items-center justify-center text-[#241CAB] group-hover:translate-x-1 transition-transform">
            →
          </div>
        </button>
      </div>

      {/* Split Media Display Panels */}
      <div className="w-full max-w-[1585px] grid grid-cols-1 lg:grid-cols-[1fr_577px] gap-[76px] items-start">
        
        {/* Left Side Presentation Frame */}
        <div className="relative w-full h-[572px] rounded-[30px] overflow-visible shadow-lg">
          <Image 
            src="/images/landingpage/pic1.png" 
            alt="Advanced Platform Overview" 
            fill 
            className="object-cover rounded-[30px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-[30px]" />
          
          <p className="absolute top-7 left-6 text-white font-['Fredoka'] font-normal text-[18px] leading-[22px] max-w-[507px]">
            Easily follow up with instructors and stay connected during tasks while receiving real-time feedback.
          </p>

          {/* Floated Glass QR Component */}
          <ScanToLoginCard />
        </div>

        {/* Right Side Challenge Badge Frame */}
        <div className="relative w-[577px] h-[576px] rounded-[15px] overflow-hidden shadow-md">
          <Image 
            src="/images/coding-challenge.jpg" 
            alt="Team Challenge Event" 
            fill 
            className="object-cover"
          />
          <span className="absolute top-6 right-6 border border-white/30 text-white font-mono text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
            TEAM B
          </span>
        </div>
      </div>

      {/* Secondary Dynamic Informational Ribbon */}
      <div className="w-full max-w-[1585px] flex flex-col gap-5 text-left pt-8">
        <h2 className="font-['Fredoka'] font-medium text-[48px] leading-[58px] bg-gradient-to-b from-[#241CAB] to-[#5D53F9] bg-clip-text text-transparent max-w-[1585px]">
          GrowthFlow is built to help students and instructors manage tasks, track progress, and communicate efficiently in one centralized platform.
        </h2>
        
        <div className="flex items-center justify-between w-full mt-4">
          {/* Linked Reusable Social Proof Card */}
          <UserConnection />
          <p className="font-['Fredoka'] font-normal text-[24px] text-[#626262] max-w-[342px]">
            Code every day to steadily improve and reach the top tier.
          </p>
        </div>
      </div>

    </section>
  );
}