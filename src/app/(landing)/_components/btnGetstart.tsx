import { ArrowRight } from "lucide-react";

export default function GetStartedButton() {
  return (
    <button className="flex items-center justify-between w-[180px] h-[60px] bg-gradient-to-r from-[#2541c3] to-[#3a4ed5] text-white pl-5 pr-2 rounded-[25px] text-[18px] font-semibold shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]">
      <span>Get Started</span>
      <div className="flex items-center justify-center w-11 h-11 bg-white rounded-full text-[#2541c3] shrink-0">
        <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
      </div>
    </button>
  );
}