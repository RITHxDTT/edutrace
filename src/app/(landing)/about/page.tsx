import Footer from "../_components/Footer";
import FeatureCards from "../_components/Featurecard";
import ConnectedSection from "../_components/Connectionsection";
import GetStartedButton from "../_components/btnGetstart";
import PageTransition from "../_components/PageTransition";
import { TickCircle } from "iconsax-react";

const stats = [
  { value: "1M+", label: "Active Students" },
  { value: "100+", label: "Instructors" },
  { value: "50K+", label: "Tasks Completed" },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="w-full min-h-screen text-slate-900 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
        {/* Page hero */}
        <section className="bg-white pt-16 pb-10 px-5 sm:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#E9F6FF] px-4 py-1.5 rounded-[10px] mb-6">
            <TickCircle size={18} color="#20B1E6" />
            <span className="text-[14px] font-medium text-slate-700">About Edutrace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[52px] font-medium bg-accent-linear-purple bg-clip-text text-transparent leading-tight max-w-3xl mx-auto">
            Built for students who want to grow
          </h1>
          <p className="text-base sm:text-lg text-gray-400 mt-4 max-w-xl mx-auto">
            Edutrace is a learning management platform designed to close the gap between what students need and what instructors can offer.
          </p>
          <div className="flex justify-center mt-8">
            <GetStartedButton />
          </div>

          {/* Stats row */}
          <div className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold bg-accent-linear-purple bg-clip-text text-transparent">
                  {s.value}
                </span>
                <span className="text-xs text-gray-400">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Hero image */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="relative rounded-3xl overflow-hidden h-[260px] sm:h-[360px] md:h-[420px] shadow-lg">
            <img
              src="/images/landingpage/pic1.png"
              alt="Students collaborating"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white text-left max-w-sm">
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
                Learning together, growing faster
              </h2>
              <p className="text-white/70 text-sm mt-2">
                Real-time collaboration tools built for modern classrooms.
              </p>
            </div>
          </div>
        </section>

        {/* Mission section */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            <div className="flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 bg-[#E9F6FF] px-4 py-1.5 rounded-[10px] w-fit">
                <TickCircle size={16} color="#20B1E6" />
                <span className="text-[13px] font-medium text-slate-700">Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-[38px] font-medium text-gray-900 leading-snug">
                Students shouldn&apos;t solve everything alone
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                We believe every student deserves timely support, transparent progress tracking, and a direct line to their instructors. Edutrace brings all of that into a single, focused platform — so students spend less time managing tasks and more time actually learning.
              </p>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Instructors get AI-powered insights, submission tracking, and real-time communication rooms — everything needed to identify at-risk students and step in early.
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-[#241cab] to-[#5d53f9] p-8 text-white min-h-[300px] flex flex-col justify-between">
              <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-lg">
                <span className="text-xs font-medium text-white/80">KSHRD Center · Cambodia</span>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-3">What we stand for</p>
                <ul className="space-y-3">
                  {[
                    "Accessible education for everyone",
                    "Transparency between students & instructors",
                    "Peer collaboration over solo struggle",
                    "Data-driven teaching decisions",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[10px]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Feature cards */}
        <section className="w-full max-w-7xl mx-auto px-5 sm:px-8 pb-20 flex flex-col items-center">
          <div className="flex flex-col items-center gap-3 text-center mb-12">
            <h2 className="font-medium text-2xl sm:text-3xl md:text-[42px] leading-tight bg-accent-linear-purple bg-clip-text text-transparent">
              Everything you need in one place
            </h2>
            <p className="text-base text-gray-400 max-w-md">
              Tools designed around how students and instructors actually work.
            </p>
          </div>
          <FeatureCards />
        </section>

        {/* Connected section */}
        <ConnectedSection />

        <Footer />
      </div>
    </PageTransition>
  );
}
