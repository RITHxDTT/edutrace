"use client";

import { Filter, ChevronDown } from "lucide-react";

interface Props {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (value: boolean) => void;
  options: readonly string[];
}

export default function AssessmentFilter({
  statusFilter,
  setStatusFilter,
  dropdownOpen,
  setDropdownOpen,
  options,
}: Props) {
  return (
    <div className="relative z-50 overflow-visible">
      <div className="bg-white rounded-[14px] border border-[#e8eaf2] px-[18px] py-3 flex items-center gap-[10px] mb-6 text-[#6b7280] overflow-visible">
        {/* Filter Icon */}
        <Filter size={15} />

        {/* Label */}
        <span className="text-[13.5px] font-medium text-[#374151]">Filter</span>

        {/* Dropdown */}
        <div className="relative overflow-visible">
          {/* Trigger */}
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center justify-between gap-2 px-[14px] py-[10px] border rounded-xl text-[13px] text-[#374151] cursor-pointer select-none w-[300px] bg-white transition-all duration-200 ${
              dropdownOpen
                ? "border-[#5b52e8] shadow-[0_4px_18px_rgba(91,82,232,0.15)]"
                : "border-[#e0e2ef] hover:border-[#c7c9d9]"
            }`}
          >
            <span>{statusFilter}</span>

            <ChevronDown
              size={14}
              className={`text-[#9ca3af] transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="
                absolute top-full left-0 mt-2
                w-[300px]
                bg-white
                border border-[#e8eaf2]
                rounded-2xl
                shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                z-[999]
                py-2
              "
            >
              {options.map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setDropdownOpen(false);
                  }}
                  className={`px-4 py-3 cursor-pointer transition-all duration-150 ${
                    statusFilter === s
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-[#374151] hover:bg-[#f5f5fc]"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
