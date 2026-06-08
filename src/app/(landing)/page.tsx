import FeatureCards from "./_components/Featurecard";
import ConnectedSection from "./_components/Connectionsection";
import HowItWorks from "./_components/HowItWorks";
import UpcomingDeadlines from "./_components/Upcommingdeadline";
import ModernRoom from "./_components/ModernRoom";
import Footer from "./_components/Footer";
import UserConnection from "./_components/UserConnected";
import GetStartedButton from "./_components/btnGetstart";
import { TickCircle } from "iconsax-react";

export default function LandingPage() {
  const qrCodeUrl = "/images/landingpage/qr.png";
  return (
    <div className="w-full min-h-screen text-slate-900 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* hero */}
      <section className="flex flex-col gap-20 md:gap-36 bg-white pt-16 pb-20 px-5 sm:px-8 max-w-7xl mx-auto text-center">
        {/* title */}
        <div>
          <div className="flex flex-col justify-center  items-center gap-4 sm:gap-6">
            <h1 className="text-3xl sm:text-4xl md:text-[48px] tracking-tight text-ai max-w-4xl mx-auto leading-tight">
              <span className="text-3xl sm:text-4xl md:text-[48px] text-linear-main font-medium">
                Stay on track. Do not miss tasks.
              </span>{" "}
              Achieve more with confidence.
            </h1>

            {/* Subtitle */}
            <p className="text-disabled text-base sm:text-lg md:text-xl mx-auto max-w-md sm:max-w-lg">
              Manage your tasks, get timely notifications, and stay connected
              with your instructors
            </p>
              <GetStartedButton />
          </div>

          {/* hero cards */}
          <div className="mt-12 sm:mt-16 flex flex-col lg:flex-row gap-6 items-stretch w-full mx-auto">
            {/* left card */}
            <div className="relative w-full lg:flex-[3] rounded-3xl bg-gray-200 h-[260px] sm:h-[340px] lg:h-[400px] shadow-md group overflow-hidden">
              <img
                src="/images/landingpage/pic1.png"
                alt="Students and Instructors"
                className="w-full h-full object-cover rounded-3xl group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent rounded-3xl" />

              <div className="absolute top-4 left-6 text-left max-w-xs">
                <p className="text-white text-xs font-light leading-snug drop-shadow-sm">
                  Easily follow up with instructors and stay connected during
                  tasks while receiving real-time feedback.
                </p>
              </div>

              {/* QR card */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[60%] z-10 flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-2xl shadow-2xl">
                <div className="bg-white p-1 rounded-xl shrink-0 shadow-sm">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain"
                  />
                </div>
                <div className="text-white text-left font-sans">
                  <h2 className="text-base sm:text-lg font-semibold mb-1 tracking-wide drop-shadow-sm">
                    Scan to login
                  </h2>
                  <p className="text-white/90 text-xs leading-tight drop-shadow-sm">
                    Easy to login by just scanning this QR code from your phone
                  </p>
                </div>
              </div>
            </div>

            {/* right card */}
            <div className="h-[200px] sm:h-[280px] lg:h-[400px] w-full lg:flex-[2] rounded-3xl overflow-hidden shadow-md">
              <img
                src="/images/landingpage/team.png"
                alt="HRD Coding Challenge"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* bottom text */}
        <div className="flex flex-col gap-5 items-start text-left">
          <p className="text-ai text-xl sm:text-2xl md:text-[32px] leading-snug">
            <span className="bg-accent-linear-purple bg-clip-text text-transparent font-semibold text-2xl sm:text-3xl md:text-[42px]">
              Edutrance{" "}
            </span>
            is built to help students and instructors manage tasks, track
            progress, and communicate efficiently in one centralized platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 lg:gap-20 items-start sm:items-end w-full">
            <UserConnection />
            <p className="text-sm sm:text-base text-gray-500">
              Code every day to steadily <br className="hidden sm:block" /> improve and reach the top tier.
            </p>
          </div>
        </div>
      </section>

      {/* about */}
      <section id="about" className="w-full max-w-7xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-20 flex flex-col items-center">
        <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-2xl text-center mb-12 sm:mb-16">
          <div className="flex items-center gap-2 bg-[#E9F6FF] px-4 py-1.5 rounded-[10px]">
            <TickCircle size={20} color="#20B1E6" />
            <span className="text-[14px] font-medium text-ai">About</span>
          </div>
          <h2 className="font-medium text-3xl sm:text-4xl md:text-[48px] leading-tight bg-accent-linear-purple bg-clip-text text-transparent">
            Student shouldn&apos;t solved everything alone
          </h2>
          <p className="text-base sm:text-lg md:text-[24px] text-disabled">
            Manage your tasks, get timely notifications, and stay connected with
            your instructors
          </p>
        </div>
        <FeatureCards />
      </section>

      {/* connected */}
      <ConnectedSection />

      {/* process */}
      <HowItWorks />

      <UpcomingDeadlines />

      <ModernRoom />

      {/* footer */}
      <Footer />
    </div>
  );
}
