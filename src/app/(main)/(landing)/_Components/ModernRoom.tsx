import React from 'react';

export default function ModernRoom() {
  return (
    <section className="bg-[#F8FAFC] py-24 px-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <h2 className="text-4xl font-extrabold text-[#3B41E3] tracking-tight">Built For Modern Room</h2>
          <div className="text-left lg:text-right max-w-md">
            <span className="border text-gray-400 font-medium text-xs px-3 py-1 rounded-full bg-white shadow-sm">Trusted By million students</span>
            <p className="text-sm text-gray-400 font-light mt-3">In GrowthyFlow, instructors are not just teaching they are supported by a system designed.</p>
          </div>
        </div>

        {/* Feature Promo Display Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <div className="relative rounded-3xl overflow-hidden h-[360px] shadow-sm bg-gray-300">
            <img src="/images/instructor-singing.jpg" alt="Instructor" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-left text-white">
              <h4 className="text-3xl font-black tracking-tight">1M+</h4>
              <p className="text-xs text-white/80 mt-1">Active students over 100+ student Master at Korean</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#3B41E3] rounded-3xl p-8 text-left text-white flex flex-col justify-between h-[360px] shadow-md">
            <div>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-all">View More</button>
              <h4 className="text-xl font-bold mt-6">In HRD Room</h4>
              <p className="text-xs text-white/70 font-light mt-2 leading-relaxed">the notification feature plays an important role in keeping both students updated in real time.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-inner">
              <p className="text-[11px] uppercase tracking-wider text-white/50 font-bold">Real time Notification Alert</p>
              <div className="bg-black/20 rounded-xl p-2.5 mt-2 text-[10px] space-y-1">
                <p className="font-bold">🇰🇭 HRD Room <span className="float-right text-white/40 font-light">1h ago</span></p>
                <p className="text-white/80">Mini Project: 3 more notifications</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 text-left border border-gray-100 flex flex-col justify-between h-[360px] shadow-sm">
            <div>
              <button className="bg-gray-50 text-gray-700 border border-gray-200 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm">View More</button>
              <h4 className="text-xl font-bold text-gray-800 mt-6">Track your learning progress</h4>
              <p className="text-xs text-gray-400 font-light mt-2 leading-relaxed">Monitor completed tasks, scores and improvement over time.</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4 bg-[#F8FAFC] h-32 flex items-end justify-center">
              {/* Simplified graphic line layout via CSS gradient */}
              <div className="w-full h-full bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent relative opacity-70" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}