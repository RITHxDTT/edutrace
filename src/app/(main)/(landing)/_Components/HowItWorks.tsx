import React from 'react';

export default function HowItWorks() {
  return (
    <section className="bg-white py-24 px-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-[#3B41E3]">How It Work</h2>
        <p className="text-gray-400 mt-4 text-sm">
          Manage your tasks, get timely notifications, and stay connected with your instructors
        </p>
      </div>

      {/* Grid Process Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start max-w-6xl mx-auto">
        
        {/* Step 1 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">1</span>
            <h4 className="font-bold text-gray-800 text-sm">Create task</h4>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100 space-y-3">
            <div className="space-y-1"><p className="text-[10px] text-gray-400">Title</p><div className="bg-white border rounded-md p-2 text-xs text-gray-700">Safety Procedure Quiz</div></div>
            <div className="space-y-1"><p className="text-[10px] text-gray-400">Date</p><div className="bg-white border rounded-md p-2 text-xs text-gray-400">May 16, 2025</div></div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">2</span>
            <h4 className="font-bold text-gray-800 text-sm">Students work and track progress</h4>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100 space-y-2 text-left">
            <p className="text-xs font-semibold text-gray-800">Complete quiz</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-blue-600"></div></div>
            <button className="w-full bg-white border text-gray-500 font-medium text-[10px] py-1.5 rounded-md shadow-sm">Submit</button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">3</span>
            <h4 className="font-bold text-gray-800 text-sm">Students work and track progress</h4>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100 text-center space-y-3">
            <div className="flex justify-center -space-x-1">
              <div className="w-6 h-6 bg-gray-300 rounded-full border border-white"></div>
              <div className="w-6 h-6 bg-gray-400 rounded-full border border-white"></div>
              <div className="w-6 h-6 bg-gray-500 rounded-full border border-white"></div>
              <div className="w-6 h-6 bg-[#3B41E3] text-white rounded-full border border-white text-[8px] font-bold flex items-center justify-center">+2</div>
            </div>
            <button className="w-full bg-[#3B41E3] text-white font-medium text-[10px] py-2 rounded-md shadow-sm">Start Meeting</button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">4</span>
            <h4 className="font-bold text-gray-800 text-sm">Instructor gets insight</h4>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100 flex items-end justify-between h-24">
            <div className="w-3 bg-[#3B41E3]/40 h-12 rounded-sm" />
            <div className="w-3 bg-[#3B41E3] h-20 rounded-sm" />
            <div className="w-3 bg-[#3B41E3]/60 h-16 rounded-sm" />
            <div className="w-3 bg-[#3B41E3]/20 h-8 rounded-sm" />
            <div className="w-3 bg-[#3B41E3] h-14 rounded-sm" />
          </div>
        </div>

      </div>

      {/* Dashboard Subcomponents Preview Block */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Calendar UI Mockup */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left">
          <h5 className="font-bold text-gray-800 text-base mb-4">Upcoming Deadlines</h5>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="border rounded-xl p-3 text-center text-xs max-w-[180px] shrink-0 mx-auto">
              <p className="font-bold text-gray-700 border-b pb-1 mb-2">August 2026</p>
              <div className="grid grid-cols-7 gap-1.5 text-gray-400 text-[10px]">
                {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="font-bold">{d}</span>)}
                {[...Array(30)].map((_, i) => (
                  <span key={i} className={`p-0.5 ${i===15 ? 'bg-[#3B41E3] text-white rounded-full font-bold' : ''}`}>{i+1}</span>
                ))}
              </div>
            </div>
            <div className="w-full space-y-2.5">
              <div className="border-l-4 border-blue-500 bg-blue-50/40 p-2.5 rounded-r-lg text-xs">
                <p className="font-bold text-gray-800">Welding Blueprint</p>
                <p className="text-[10px] text-gray-400 mt-0.5">May 16, 2025 • In Progress</p>
              </div>
              <div className="border-l-4 border-green-500 bg-green-50/40 p-2.5 rounded-r-lg text-xs">
                <p className="font-bold text-gray-800">Safety Procedure Quiz</p>
                <p className="text-[10px] text-gray-400 mt-0.5">May 16, 2025 • Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytical UI Mockup */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left flex flex-col justify-between">
          <div>
            <h5 className="font-bold text-gray-800 text-base mb-1">Instructor Insight</h5>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-[10px] text-red-500 uppercase font-black tracking-wider">At-Risk Students</p>
                <p className="text-4xl font-black text-gray-900 mt-1">5</p>
                <div className="w-16 h-16 border-8 border-red-500 border-t-transparent rounded-full flex items-center justify-center text-[10px] font-bold mt-3 text-gray-700">25%</div>
              </div>
              <div className="space-y-2 text-[11px] text-gray-600">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">AI Recommendations</p>
                <p className="flex items-start gap-1.5"><span className="text-green-500 font-bold">✓</span> Check in with 5 at-risk students</p>
                <p className="flex items-start gap-1.5"><span className="text-green-500 font-bold">✓</span> Review quiz scores for Module 3</p>
              </div>
            </div>
          </div>
          <button className="w-full bg-[#3B41E3] text-white py-2 rounded-xl text-xs font-semibold mt-4 shadow-sm">View Full Report</button>
        </div>
      </div>
    </section>
  );
}