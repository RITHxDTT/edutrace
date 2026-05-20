import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from './_components/Hero';
import Features from './_components/Features';
import HowItWorks from './_components/HowItWorks';
import ModernRoom from './_components/ModernRoom';
import Footer from './_components/Footer';


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