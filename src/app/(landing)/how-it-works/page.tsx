import Footer from "../_components/Footer";
import HowItWorks from "../_components/HowItWorks";
import GetStartedButton from "../_components/btnGetstart";
import PageTransition from "../_components/PageTransition";

export default function HowItWorksPage() {
  return (
    <PageTransition>
    <div className="w-full min-h-screen text-slate-900 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Page hero */}
      <section className="bg-white pt-16 pb-6 px-5 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#E9F6FF] px-4 py-1.5 rounded-[10px] mb-6">
          <span className="text-[#20B1E6]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 12.833A5.833 5.833 0 1 0 7 1.167a5.833 5.833 0 0 0 0 11.666Z" stroke="#20B1E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.521 7l1.651 1.65 3.307-3.3" stroke="#20B1E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[14px] font-medium text-slate-700">Step by step</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-[52px] font-medium bg-accent-linear-purple bg-clip-text text-transparent leading-tight max-w-3xl mx-auto">
          How Edutrace Works
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mt-4 max-w-xl mx-auto">
          Four simple steps to manage tasks, collaborate with peers, and get meaningful insights — all in one place.
        </p>
        <div className="flex justify-center mt-8">
          <GetStartedButton />
        </div>
      </section>

      {/* Steps section */}
      <HowItWorks />

      {/* Process detail */}
      <section className="bg-white py-20 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="rounded-3xl bg-gradient-to-br from-[#241cab] to-[#5d53f9] p-8 text-white flex flex-col justify-between min-h-[260px]">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold mb-6">1</div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Instructors create tasks</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Set up assignments, homework, or mini-projects with deadlines, attached files, and classroom assignments — all in seconds.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#F8FAFC] border border-gray-100 p-8 flex flex-col justify-between min-h-[260px]">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold mb-6">2</div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Students track & submit</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Students see their assigned tasks on a unified dashboard, track progress, log work sessions, and submit directly from the platform.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#F8FAFC] border border-gray-100 p-8 flex flex-col justify-between min-h-[260px]">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold mb-6">3</div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Collaborate in rooms</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Each assessment has a dedicated communication room with video, audio, screen sharing, and real-time chat so nobody works alone.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#241cab] to-[#5d53f9] p-8 text-white flex flex-col justify-between min-h-[260px]">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold mb-6">4</div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Instructors gain insights</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                AI-powered reports surface at-risk students, submission trends, and progress metrics so instructors can act before it&apos;s too late.
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
    </PageTransition>
  );
}
