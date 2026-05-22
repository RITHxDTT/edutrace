import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { PrimaryButton } from './Buttons/PrimaryButton';

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#5f5f79] font-bold text-2xl tracking-tight">
          <Image
            width={0}
            height={0}
            src={"/images/logo/growthyFlowLogo.png"}
            alt="Growthyflow Logo"
            className="w-60 h-9.5 object-contain"
            unoptimized
          />
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium text-sm">
          <Link href="#" className="hover:text-[#2D31FA] transition-colors">How It Works</Link>
          <Link href="#" className="hover:text-[#2D31FA] transition-colors">About</Link>
          <Link href="/register" className="hover:text-[#2D31FA] transition-colors">Register</Link>
          <PrimaryButton className={"text-white font-semibold"} size={"sm"}>
            <Link
              href="/login"
            >
              Login
            </Link>
          </PrimaryButton>

        </div>
      </div>
    </nav>
  );
}