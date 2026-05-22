import React from 'react';

export default function HowItWorks() {
  const steps = [
    { num: "1", title: "Create task", desc: "Define clear instructions and milestones." },
    { num: "2", title: "Students work and track progress", desc: "Interact directly with integrated dashboards." },
    { num: "3", title: "Students work and track progress", desc: "Collab via instant meetings.", special: true },
    { num: "4", title: "Instructor gets insight", desc: "Complete architectural visual breakdown metrics." }
  ];

  return (
    <section id="how-it-works" className="w-full py-20 bg-[#F4F7FE] flex flex-col items-center px-6">
      <div className="text-center mb-16">
        <div className="inline-block bg-[#E9F6FF] px-4 py-1.5 rounded-[10px] mb-4">
          <span className="text-[#20B1E6] font-bold">✓ About</span>
        </div>
        <h2 className="font-['Fredoka'] font-medium text-[48px] bg-gradient-to-r from-[#241CAB] to-[#5D53F9] bg-clip-text text-transparent">How It Works</h2>
        <p className="text-[#BABABA] font-['Fredoka'] text-xl">Manage your tasks, get timely notifications, and stay connected</p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 relative min-h-[220px]">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {step.num}
            </div>
            <h4 className="font-bold text-lg text-gray-800">{step.title}</h4>
            
            {step.special ? (
              <div className="mt-2 flex flex-col gap-3">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 bg-gray-300 rounded-full border border-white" />
                  <div className="w-7 h-7 bg-gray-400 rounded-full border border-white" />
                  <div className="w-7 h-7 bg-indigo-500 text-white rounded-full text-[10px] flex items-center justify-center border border-white">+2</div>
                </div>
                <button className="w-full py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm">📹 Start Meeting</button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}