import React from 'react';
import { ArrowRight, QrCode } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-white pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight">
        <span className="text-[#3B41E3]">Stay on track. Don't miss tasks.</span> Achieve more with confidence.
      </h1>
      
      {/* Subtitle */}
      <p className="text-gray-400 mt-6 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
        Manage your tasks, get timely notifications, and stay connected with your instructors
      </p>

      {/* CTA Button */}
      <button className="mt-8 bg-[#3B41E3] hover:bg-[#2D31FA] text-white font-medium rounded-full px-6 py-3.5 inline-flex items-center gap-2 text-sm shadow-lg shadow-[#3B41E3]/20 transition-all">
        Get Started
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Dual Display Cards */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
        
        {/* Left Interactive Image/QR Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-200 h-[400px] shadow-md group">
          {/* Main Background Image - Replace src path */}
          <img 
            src="/images/students-group.jpg" 
            alt="Students and Instructors" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <div className="absolute top-4 left-6 text-left max-w-xs">
            <p className="text-white text-xs font-light leading-snug drop-shadow-sm">
              Easily follow up with instructors and stay connected during tasks while receiving real-time feedback.
            </p>
          </div>

          {/* Floated Glass QR Component */}
          <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 text-left shadow-xl border border-white/40 max-w-sm">
            <div className="bg-white p-2 rounded-xl shadow-inner text-gray-800">
              <QrCode className="w-12 h-12" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Scan to login</h4>
              <p className="text-gray-500 text-xs mt-0.5 leading-tight">
                Easy to login by just scanning this QR code from your phone
              </p>
            </div>
          </div>
        </div>

        {/* Right Event Poster Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F126C] to-[#252AE5] h-[400px] shadow-md flex items-center justify-center">
          {/* Main Background Image - Replace src path */}
          <img 
            src="/images/coding-challenge.jpg" 
            alt="HRD Coding Challenge" 
            className="w-full h-full object-cover mix-blend-overlay opacity-80"
          />
          {/* Floating UI Badges */}
          <span className="absolute top-6 right-6 border border-white/30 text-white font-mono text-xs font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
            TEAM B
          </span>
        </div>
      </div>

      {/* Short Branding Copy */}
      <div className="mt-20 max-w-4xl mx-auto text-left lg:text-center px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
          <span className="text-[#3B41E3]">GrowthyFlow</span> is built to help students and instructors manage tasks, track progress, and communicate efficiently in one centralized platform.
        </h3>
        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden"><img src="/images/user1.jpg" alt="" /></div>
              <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white overflow-hidden"><img src="/images/user2.jpg" alt="" /></div>
              <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white overflow-hidden"><img src="/images/user3.jpg" alt="" /></div>
            </div>
            <p className="text-xs text-gray-700 font-medium">Helping students stay connected with instructors</p>
          </div>
          <p className="text-sm text-gray-400 font-light max-w-sm text-left">
            Code every day to steadily improve and reach the top tier.
          </p>
        </div>
      </div>
    </section>
  );
}