"use client"
import LogoComponent from '@/app/(auth)/_components/Logo';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ProfileData } from '@/types/user';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between ">
        {/* Logo */}
        <LogoComponent />

        {/* page nagivation */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium text-sm">
          <button onClick={() => router.push("/")} className="hover:text-[#2D31FA] transition-colors">How It Works</button>
          <button onClick={() => router.push("/")} className="hover:text-[#2D31FA] transition-colors">About</button>
          <button onClick={() => router.push("/")} className="hover:text-[#2D31FA] transition-colors">Register</button>
          <button
            onClick={() => router.push("/login")}
            className="bg-[#5157F5] hover:bg-[#2D31FA] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md shadow-[#3B41E3]/20 transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}