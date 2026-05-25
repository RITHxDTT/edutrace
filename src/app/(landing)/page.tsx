import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "./_components/Hero";
import FeaturesHeader from "./_components/FeaturesHeader";
import FeatureCards from "./_components/Featurecard";
import ConnectedSection from "./_components/Connectionsection";
import HowItWorks from "./_components/HowItWorks";
import UpcomingDeadlines from "./_components/Upcommingdeadline";
import ModernRoom from "./_components/ModernRoom";
import Footer from "./_components/Footer";
import UserConnection from "./_components/UserConnected";
import ScanToLoginCard from "./_components/Cardqr";
import GetStartedButton from "./_components/btnGetstart";

export default function LandingPage() {
  const qrCodeUrl = "/images/landingpage/qr.png";
  return (
    <div className="w-full min-h-screen  text-slate-900 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <Navbar />
      {/* hero */}
      <section className="flex flex-col gap-40 bg-white pt-16  pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* title */}

        <div>
          <div className=" flex flex-col justify-center items-center gap-5">
            <h1 className="  text-[48px] tracking-tight text-textColor max-w-4xl mx-auto leading-tight">
              <span className="text-[48px] bg-accent-linear-purple bg-clip-text text-transparent font-[500]">
                Stay on track. Don't miss tasks.
              </span>{" "}
              Achieve more with confidence.
            </h1>

            {/* Subtitle */}
            <p className=" text-textDisable  md:text-lg text-[24px] mx-auto  w-[45%]">
              Manage your tasks, get timely notifications, and stay connected
              with your instructors
            </p>

            {/* component btn */}
            <GetStartedButton />
          </div>

          {/* card */}
          <div className="justify-between mt-16 flex  gap-8 items-stretch max-w-[1500px] mx-auto">
            {/* left */}
            <div className="relative w-[900px] rounded-3xl bg-gray-200 h-[400px] shadow-md group">
              <img
                src="/images/landingpage/pic1.png"
                alt="Students and Instructors"
                className="w-full h-full object-cover rounded-3xl group-hover:scale-98 transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl" />

              <div className="absolute top-4 left-6 text-left max-w-xs">
                <p className="text-white text-xs font-light leading-snug drop-shadow-sm">
                  Easily follow up with instructors and stay connected during
                  tasks while receiving real-time feedback.
                </p>
              </div>

              {/* qr  */}
              <div className="w-[55%] absolute bottom-4 left-4 right-4 z-10 flex items-center gap-4 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-2xl">
                <div className="bg-white p-1 rounded-xl flex-shrink-0 shadow-sm ">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-20 h-20 object-contain"
                  />
                </div>

                <div className="text-white text-left font-sans">
                  <h2 className="text-xl font-semibold mb-1 tracking-wide drop-shadow-sm">
                    Scan to login
                  </h2>
                  <p className="text-white/90 text-xs leading-tight drop-shadow-sm">
                    Easy to login by just scanning this QR code from your phone
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-[500px] rounded-3xl overflow-hidden shadow-md">
              <img
                src="/images/landingpage/team.png"
                alt="HRD Coding Challenge"
                className="w-full h-full "
              />
            </div>
          </div>
        </div>

        {/* tecxt */}
        <div className="flex flex-col gap-[20] items-start ">
          <p className="text-textColor text-[32px]">
            <span className="bg-accent-linear-purple bg-clip-text text-transparent  font-semibold text-[42px] x-5">
              GrowthyFlow
            </span>
            is built to help students and instructors manage tasks, track
            progress, and communicate efficiently in one centralized platform.
          </p>
          <div className="flex gap-50 items-end ">
            <UserConnection />
            <p>
              Code every day to steadily <br /> improve and reach the top tier.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center">
        {/* intro  */}
        <div className="flex flex-col items-center gap-20 max-w-2xl text-center mb-16">
          <div className="flex items-center gap-2 bg-[#E9F6FF] px-4 py-1.5 rounded-[10px]">
            <span className="text-[#20B1E6] font-bold text-sm">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.99984 12.8346C10.2082 12.8346 12.8332 10.2096 12.8332 7.0013C12.8332 3.79297 10.2082 1.16797 6.99984 1.16797C3.7915 1.16797 1.1665 3.79297 1.1665 7.0013C1.1665 10.2096 3.7915 12.8346 6.99984 12.8346Z"
                  stroke="#20B1E6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.521 6.99849L6.17183 8.64932L9.47933 5.34766"
                  stroke="#20B1E6"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="font-['Fredoka'] text-[14px] font-medium text-textColor">
              About
            </span>
          </div>
          <h2 className=" font-medium text-[48px] leading-tight bg-accent-linear-purple bg-clip-text text-transparent">
            Student shouldn’t solved everything alone
          </h2>
          <p className=" text-[24px] text-textDisable">
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
