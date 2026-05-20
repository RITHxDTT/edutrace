import React from 'react';

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#2D31FA] font-bold text-2xl tracking-tight">
          <span className="inline-block bg-[#2D31FA] text-white p-1 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm text-xs">
            G
          </span>
          GrowthyFlow
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium text-sm">
          <a href="#" className="hover:text-[#2D31FA] transition-colors">How It Works</a>
          <a href="#" className="hover:text-[#2D31FA] transition-colors">About</a>
          <a href="#" className="hover:text-[#2D31FA] transition-colors">Register</a>
          <a 
            href="#" 
            className="bg-[#5157F5] hover:bg-[#2D31FA] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md shadow-[#3B41E3]/20 transition-all"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}