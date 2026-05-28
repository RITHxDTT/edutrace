import LogoComponent from '@/app/(auth)/_components/Logo';
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A237E] text-white/80 py-16 px-6 md:px-16 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 border-b border-white/10 pb-12">
        <div className="max-w-md">
          <div className="flex items-center  gap-2 mb-4">
          <img src="./images/logo/edutraceLogo.png" alt="" className='w-[33px] h-[40px]'/>
          <p className='text-[24px] font-semibold'>Edutrace</p>
          </div>
          <p className="text-sm leading-relaxed text-white/60">
            A collaborative educational hub designed to bridge the gap between classroom teaching and student understanding. An accessible academic support platform that fosters peer-to-peer learning through incentives, while ensuring accuracy and integrity with instructor-reviewed answers.
          </p>
        </div>

        {/* <div className="flex gap-16 text-sm">
          <div className="space-y-3">
            <h5 className="font-bold text-white text-base">Platform</h5>
            <p className="hover:text-white cursor-pointer transition-colors">How It Works</p>
            <p className="hover:text-white cursor-pointer transition-colors">Features</p>
            <p className="hover:text-white cursor-pointer transition-colors">Pricing</p>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-white text-base">Company</h5>
            <p className="hover:text-white cursor-pointer transition-colors">About Us</p>
            <p className="hover:text-white cursor-pointer transition-colors">Contact</p>
            <p className="hover:text-white cursor-pointer transition-colors">Privacy Policy</p>
          </div>
        </div> */}
      </div>
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-4">
       
      </div>
    </footer>
  );
}