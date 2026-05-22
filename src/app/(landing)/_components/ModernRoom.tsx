import React from "react";
import Viewmore from "./Viewmore";

export default function ModernRoom() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24">
      
      {/* Header Context */}
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-12">
        <h2 className="font-medium text-[48px] bg-accent-linear-purple bg-clip-text text-transparent">
          Built For Modern Room
        </h2>
        <p className="text-textDisable text-sm max-w-xs text-right">
          In GrowthyFlow, instructors are not just teaching they are supported by a system designed.
        </p>
      </div>

      
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        
        
        <div className="flex-1 h-[500px] rounded-[32px] overflow-hidden group shadow-lg relative">
          <img
            src="/images/landingpage/dc.png"
            alt="Instructor"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Top Positioned Action Link */}
          <div className="absolute top-8 left-8">
            <Viewmore colors="text-white" border="border-white/20"/>
          </div>
          
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-5xl font-black ">1M+</h1>
            <p className="text-sm opacity-80 mt-1">
              Active students over <br />
               100+ student Master <br />
                at Korean
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex-1 bg-linear-purple h-[500px] rounded-[32px] p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div>
            <Viewmore colors="text-white" border="border-white/20"/>
            <h4 className="text-2xl font-bold mt-8">In HRD Room</h4>
            <p className="text-xs opacity-70 mt-2 leading-relaxed">
              The notification feature plays an important role in keeping both students updated in real time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mt-4">
            
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.97 16.185V22.185C26.97 22.575 26.955 22.95 26.91 23.31C26.565 27.36 24.18 29.37 19.785 29.37H19.185C18.81 29.37 18.45 29.55 18.225 29.85L16.425 32.25C15.63 33.315 14.34 33.315 13.545 32.25L11.745 29.85C11.55 29.595 11.115 29.37 10.785 29.37H10.185C5.40001 29.37 3 28.185 3 22.185V16.185C3 11.79 5.02501 9.40501 9.06001 9.06001C9.42001 9.01501 9.79501 9 10.185 9H19.785C24.57 9 26.97 11.4 26.97 16.185Z"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32.9701 10.185V16.185C32.9701 20.595 30.945 22.965 26.91 23.31C26.955 22.95 26.9701 22.575 26.9701 22.185V16.185C26.9701 11.4 24.57 9 19.785 9H10.1851C9.79506 9 9.42006 9.01501 9.06006 9.06001C9.40506 5.02501 11.7901 3 16.1851 3H25.785C30.57 3 32.9701 5.40001 32.9701 10.185Z"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.2432 19.875H20.2567"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.9932 19.875H15.0067"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.74325 19.875H9.75675"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="font-['Fredoka'] font-medium text-lg leading-tight mt-2 mb-2">
              Real time <br /> Notification Alert
            </div>
            <img src="/images/landingpage/notification.png" alt="Notification visual asset" className="w-full h-auto" />
          </div>

          
          <div className="flex justify-center gap-1.5 mt-4">
            <span className="w-6 h-1.5 bg-white rounded-full" />
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex-1 bg-white h-[500px] rounded-[32px] p-8 border border-gray-100 flex flex-col justify-between shadow-lg">
          <div>
            <Viewmore colors="text-indigo-600" border="border-indigo-600/20"/>
            <h4 className="text-2xl font-bold text-gray-800 mt-8">
              Track your learning progress
            </h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Monitor completed tasks, scores and improvement over time.
            </p>
          </div>

          <img src="/images/landingpage/graph.png" alt="Analytics Graph" className="w-full h-auto rounded-[5px]" />

          
          <div className="flex justify-center gap-1.5 mt-4">
            <span className="w-6 h-1.5 bg-indigo-600 rounded-full" />
            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
          </div>
        </div>

      </div>
    </section>
  );
}