export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B41E3]">How It Works</h2>
        <p className="text-gray-400 mt-3 text-sm">
          Manage your tasks, get timely notifications, and stay connected with
          your instructors
        </p>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">

        {/* Step 1 */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 min-h-[260px]">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <h4 className="text-textColor text-[18px]">Create task</h4>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
            <div className="space-y-1">
              <p className="text-[10px] text-textColor">Title</p>
              <div className="bg-white border rounded-md p-2 text-xs text-gray-700">
                Safety Procedure Quiz
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-textDisable">Date</p>
              <div className="bg-white border rounded-md p-2 text-xs text-gray-400">
                May 16, 2025
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 min-h-[260px]">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <h4 className="text-textColor text-[18px]">
              Students work and track progress
            </h4>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2 text-left">
            <p className="text-xs font-semibold text-textColor">Complete quiz</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-blue-600 rounded-full" />
            </div>
            <button className="w-full bg-white border text-gray-500 font-medium text-[10px] py-1.5 rounded-md shadow-sm">
              Submit
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 min-h-[260px]">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <h4 className="text-textColor text-[18px]">
              Collaborate with peers
            </h4>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100 text-center space-y-3">
            <div className="flex justify-center -space-x-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-[40px] h-[40px] rounded-full border-2 border-white overflow-hidden">
                  <img
                    src="/images/landingpage/piseth.jpg"
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-[40px] h-[40px] bg-[#3B41E3] text-white rounded-full border-2 border-white text-[8px] font-bold flex items-center justify-center">
                +2
              </div>
            </div>
            <button className="w-full bg-gradient-to-b from-[#241cab] to-[#5d53f9] text-white font-medium text-[10px] py-2 rounded-md shadow-sm">
              Start Meeting
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 min-h-[260px]">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <h4 className="text-textColor text-[18px]">
              Instructor gets insight
            </h4>
          </div>
          <img src="/images/landingpage/graph2.png" alt="Analytics graph" className="w-full h-auto rounded-lg" />
        </div>

      </div>
    </section>
  );
}
