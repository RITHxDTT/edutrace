import React from "react";
import { TickIcon } from "./Tick";

export default function UpcomingDeadlines() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left Deadlines Panel */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="font-['Fredoka'] text-2xl font-medium mb-6 text-gray-800">
          Upcoming Deadlines
        </h3>
        <div className="space-y-4">
          <img src="/images/landingpage/calendarComming.png" alt="" />
        </div>
      </div>

      {/* Right Instructor Insights Panel */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
        <h3 className=" text-2xl font-medium text-textColor mb-1">
          Instructor Insight
        </h3>
        <div className="flex  justify-between items-start">
          <div className="flex flex-col ">
            <p className="text-xs text-red uppercase tracking-wider font-semibold">
              At-Risk Students
            </p>
            <span className="text-5xl font-bold text-red-500 block mt-2">
              5
            </span>
            {/* circle  */}
            <div className="w-24 h-24 rounded-full border-8 border-red-500  flex items-center justify-center  text-lg text-gray-800">
              <div className="flex flex-col items-center ">
                <p className="font-[600]">25%</p>
                <p className="text-[10px] ">OF CLASS</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8 mt-6 pt-6">
            <div className="flex-1 space-y-3">
              <p className="text-xs text-textColor flex gap-2">
                <TickIcon /> Check in with 5 at-risk students
              </p>
              <p className="text-xs text-textColor flex gap-2">
                <TickIcon /> Review quiz scores for Module 3
              </p>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-md">
                View Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
