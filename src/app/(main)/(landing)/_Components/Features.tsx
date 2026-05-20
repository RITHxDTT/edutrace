import React from 'react';
import { MessageSquare, Users, LineChart, Video, Calendar, ClipboardCheck, Bot } from 'lucide-react';

export default function Features() {
  return (
    <section className="bg-[#F8FAFC] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3B41E3] tracking-tight">
            Student shouldn't solved everything alone
          </h2>
          <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
            Manage your tasks, get timely notifications, and stay connected with your instructors
          </p>
        </div>

        {/* Core Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-28">
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Instructor Access</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Simplify how you reach out for guidance with integrated tools that keep you and your teachers in sync.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Peer Support</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Connect with classmates to share resources and tackle complex assignments as a team.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <LineChart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Progress Tracking</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Stay ahead of your curriculum with real-time insights into your tasks and upcoming milestones.</p>
          </div>
        </div>

        {/* Central Interconnected Features Layout */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E22D1] tracking-tight">
            Everything connected to the task
          </h2>
        </div>

        {/* Features Orbit Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Column Blocks */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Video className="w-6 h-6" /></div>
              <div>
                <h5 className="font-bold text-gray-800 mb-1 text-base">Meeting Room</h5>
                <p className="text-xs text-gray-400 leading-relaxed">Host virtual sessions effortlessly with built-in video conferencing and real-time collaboration tools for students and instructors.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Users className="w-6 h-6" /></div>
              <div>
                <h5 className="font-bold text-gray-800 mb-1 text-base">Student Progress</h5>
                <p className="text-xs text-gray-400 leading-relaxed">Monitor academic growth with detailed analytics and visual charts that highlight performance trends and areas for improvement.</p>
              </div>
            </div>
          </div>

          {/* Center Main Core Element */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md text-center py-12 max-w-sm mx-auto w-full">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-50/50">
              <ClipboardCheck className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-black text-gray-800 mb-2">Task</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Organize your workload by creating, prioritizing, and tracking individual tasks to ensure every assignment is completed on time.
            </p>
          </div>

          {/* Right Column Blocks */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Calendar className="w-6 h-6" /></div>
              <div>
                <h5 className="font-bold text-gray-800 mb-1 text-base">Calender</h5>
                <p className="text-xs text-gray-400 leading-relaxed">Keep track of deadlines, lesson schedules, and upcoming events with an integrated calendar that syncs across all your devices.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Bot className="w-6 h-6" /></div>
              <div>
                <h5 className="font-bold text-gray-800 mb-1 text-base">AI Instructor Report</h5>
                <p className="text-xs text-gray-400 leading-relaxed">Receive automated insights and feedback generated by AI to help identify student risks and optimize teaching strategies.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}