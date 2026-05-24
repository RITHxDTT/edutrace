<<<<<<< HEAD
"use client"
import LogoComponent from '@/app/(auth)/_components/Logo';
import React from 'react';
import { useRouter } from 'next/navigation';
=======
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { PrimaryButton } from './Buttons/PrimaryButton';
>>>>>>> 19e13e2 (Authentication: Login done)

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between ">
        {/* Logo */}
<<<<<<< HEAD
        <LogoComponent/>
=======
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
>>>>>>> 19e13e2 (Authentication: Login done)

      {/* page nagivation */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium text-sm">
<<<<<<< HEAD
          <button onClick={()=>router.push("/")} className="hover:text-[#2D31FA] transition-colors">How It Works</button>
          <button onClick={()=>router.push("/")} className="hover:text-[#2D31FA] transition-colors">About</button>
          <button onClick={()=>router.push("/")} className="hover:text-[#2D31FA] transition-colors">Register</button>
          <button 
          onClick={()=>router.push("/login")}
            className="bg-[#5157F5] hover:bg-[#2D31FA] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md shadow-[#3B41E3]/20 transition-all"
          >
            Login
          </button>
=======
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

>>>>>>> 19e13e2 (Authentication: Login done)
        </div>
      </div>
    </nav>
  );
}