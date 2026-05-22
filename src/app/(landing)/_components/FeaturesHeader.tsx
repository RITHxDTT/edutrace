export default function FeaturesHeader() {
  return (
    <div className="flex flex-col items-center gap-4 max-w-2xl text-center mb-16">
      <div className="flex items-center gap-2 bg-[#E9F6FF] px-4 py-1.5 rounded-[10px]">
        <span className="text-[#20B1E6] font-bold text-sm">✓</span>
        <span className="font-['Fredoka'] text-[14px] font-medium text-[#3E3E3E]">About</span>
      </div>
      <h2 className=" font-medium text-[48px] leading-tight bg-accent-linear-purple bg-clip-text text-transparent">
        Student shouldn’t solved everything alone
      </h2>
      <p className=" text-[24px] text-textDisable">
        Manage your tasks, get timely notifications, and stay connected with your instructors
      </p>
    </div>
  );
}