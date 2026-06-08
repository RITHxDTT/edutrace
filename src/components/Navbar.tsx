"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/logo/edutraceLogo.png"
            alt="Edutrace"
            width={60}
            height={40}
            className="object-contain"
          />
          <span className="text-lg font-semibold text-linear-main">Edutrace</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            About
          </Link>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/register"
            className="text-sm font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#4F6BFF] to-[#7B61FF] shadow-md shadow-indigo-500/20 hover:brightness-110 transition-all"
          >
            Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-3 space-y-1 shadow-lg">
          <Link
            href="/how-it-works"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-600 py-2.5 hover:text-indigo-600 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-600 py-2.5 hover:text-indigo-600 transition-colors"
          >
            About
          </Link>
          <div className="pt-2 mt-1 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-600 py-2.5 text-center hover:text-indigo-600 transition-colors"
            >
              Register
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block text-sm font-semibold text-white py-3 text-center rounded-lg bg-gradient-to-r from-[#4F6BFF] to-[#7B61FF] shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
