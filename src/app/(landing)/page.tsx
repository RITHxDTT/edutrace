import Navbar from "@/components/Navbar";
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
    <div className="w-full min-h-screen  text-slate-900 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <Navbar />
      {/* hero */}
      <section className="flex flex-col gap-40 bg-white pt-16  pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* title */}

        <div>
          <div className=" flex flex-col justify-center items-center gap-5">
            <h1 className="  text-[48px] tracking-tight text-ai max-w-4xl mx-auto leading-tight">
              <span className="text-[48px] text-linear-main font-medium">
                Stay on track. Do not miss tasks.
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
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent rounded-3xl" />

              <div className="absolute top-4 left-6 text-left max-w-xs">
                <p className="text-white text-xs font-light leading-snug drop-shadow-sm">
                  Easily follow up with instructors and stay connected during
                  tasks while receiving real-time feedback.
                </p>
              </div>

              {/* qr  */}
              <div className="w-[55%] absolute bottom-4 left-4 right-4 z-10 flex items-center gap-4 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-2xl">
                <div className="bg-white p-1 rounded-xl shrink-0 shadow-sm ">
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
          <p className="text-ai text-[32px]">
            <span className="bg-accent-linear-purple bg-clip-text text-transparent font-semibold text-[42px] x-5">
              Endutrance {" "}
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

            </span>
            <TickCircle size={20} color="#20B1E6" />
            <span className="text-[14px] font-medium text-ai">
              About
            </span>
          </div>
          <h2 className="font-medium text-[48px] leading-tight bg-accent-linear-purple bg-clip-text text-transparent">
            Student shouldn’t solved everything alone
          </h2>
          <p className=" text-[24px] text-disabled">
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
