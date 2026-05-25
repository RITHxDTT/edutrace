import React from "react";
import { ArrowRight, QrCode } from "lucide-react";
import GetStartedButton from "./btnGetstart";
import ScanToLoginCard from "./Cardqr";
import ConnectedSection from "./Connectionsection";
import UserConnection from "./UserConnected";

export default function Hero() {
  return (
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
              <ScanToLoginCard />
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
            <span className="bg-accent-linear-purple bg-clip-text text-transparent  font-[600] text-[42px] x-5">
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
  );
}
