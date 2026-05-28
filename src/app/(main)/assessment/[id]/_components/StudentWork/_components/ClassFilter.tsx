import { useState } from "react";
import { FILTER_OPTIONS } from "../constant";

type FilterOption = typeof FILTER_OPTIONS[number];

interface Props {
  value: FilterOption;
  onChange: (v: FilterOption) => void;
}

export function ClassFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-8 px-4 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm font-medium text-gray-700 cursor-pointer min-w-[160px] font-sans"
      >
        {value}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 bg-white border border-gray-200 rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50 min-w-full overflow-hidden">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => { onChange(option); setOpen(false); }}
              className={`block w-full px-4 py-2.5 border-none text-left text-sm cursor-pointer font-sans transition-colors duration-150
                ${value === option
                  ? "bg-[#f5f4ff] font-semibold text-[#5b52e8]"
                  : "bg-transparent font-normal text-gray-700 hover:bg-gray-50"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}