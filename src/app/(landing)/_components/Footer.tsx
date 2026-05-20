import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#1E22D1] text-white/80 py-16 px-6 text-left">
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 space-y-6">
        <div className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
          <span className="inline-block bg-white text-[#1E22D1] px-2 py-0.5 rounded-bl-lg rounded-tr-lg font-black text-sm">
            G
          </span>
          HRD Room
        </div>
        <p className="text-xs text-white/60 font-light max-w-xl leading-relaxed">
          A collaborative educational hub designed to bridge the gap between classroom teaching and student understanding. An accessible academic support platform that fosters peer-to-peer learning through incentives, while ensuring accuracy and integrity with instructor-reviewed answers.
        </p>
      </div>
    </footer>
  );
}