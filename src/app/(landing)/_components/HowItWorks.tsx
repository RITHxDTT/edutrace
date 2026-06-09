export default function HowItWorks() {
  return (
    <section className="bg-white py-24 px-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-[#3B41E3]">How It Work</h2>
        <p className="text-gray-400 mt-4 text-sm">
          Manage your tasks, get timely notifications, and stay connected with
          your instructors
        </p>
      </div>

      {/* Grid Process Pipeline */}
      <div className="flex gap-10 max-w-6xl mx-auto">
        {/*          */}
        <div className="h-[280px] w-[330px] flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-accent-linear-purple bg-clip-text text-transparent flex items-center justify-center">
              1
            </span>
            <h4 className=" text-textColor text-[18px]">Create task</h4>
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

        {/*           */}
        <div className="h-[280px] w-[330px] flex flex-col justify-between  bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent-linear-purple bg-clip-text text-transparent flex items-center justify-center">
              2
            </span>
            <h4 className=" text-textColor text-[18px]">
              Students work and track progress
            </h4>
          </div>
          <div className="pt-[20px] bg-white rounded-xl p-4 border border-gray-100 space-y-2 text-left">
            <p className="text-xs font-semibold text-textColor">
              Complete quiz
            </p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-blue-600"></div>
            </div>
            <button className="w-full bg-white border text-gray-500 font-medium text-[10px] py-1.5 rounded-md shadow-sm">
              Submit
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="h-[280px] w-[330px] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent-linear-purple bg-clip-text text-transparent flex items-center justify-center">
              3
            </span>
            <h4 className=" text-textColor text-[18px]">
              Students work and track progress
            </h4>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100 text-center space-y-3">
            <div className="flex justify-center -space-x-1">
              <div className="w-[46px] h-[46px]  rounded-full border border-white">
                <img
                  src="/images/landingpage/piseth.jpg"
                  alt="User avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="w-[46px] h-[46px]  rounded-full border border-white">
                <img
                  src="/images/landingpage/piseth.jpg"
                  alt="User avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div
                className="w-[46px] h-[46px]
               rounded-full border border-white"
              >
                <img
                  src="/images/landingpage/piseth.jpg"
                  alt="User avatar"
                  className="w-full h-full object-cover  rounded-full"
                />
              </div>
              <div className="w-[46px] h-[46px] bg-[#3B41E3] text-white rounded-full border border-white text-[8px] font-bold flex items-center justify-center">
                +2
              </div>
            </div>
            <button className="w-full bg-accent-linear-purple text-white font-medium text-[10px] py-2 rounded-md shadow-sm">
              Start Meeting
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="h-[280px] w-[330px] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent-linear-purple bg-clip-text text-transparent flex items-center justify-center">
              4
            </span>
            <h4 className=" text-textColor text-[18px]">
              Instructor gets insight
            </h4>
          </div>
          <img src="/images/landingpage/graph2.png" alt="" />
        </div>
      </div>
    </section>
  );
}
