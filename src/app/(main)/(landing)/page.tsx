import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/app/(main)/(landing)/_Components/Hero';
import Features from '@/app/(main)/(landing)/_Components/Features';
import HowItWorks from '@/app/(main)/(landing)/_Components/HowItWorks';
import ModernRoom from '@/app/(main)/(landing)/_Components/ModernRoom';
import Footer from '@/app/(main)/(landing)/_Components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased selection:bg-[#3B41E3]/10 selection:text-[#3B41E3]">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ModernRoom />
      </main>
      <Footer />
    </div>
  );
}