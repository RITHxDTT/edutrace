"use client";

import { Filter } from "lucide-react";
import PrimarySelect from "@/components/Selects/PrimarySelect";
import { SelectItem } from "@heroui/select";

interface Props {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  options: readonly string[];
}

export default function AssessmentFilter({
  statusFilter,
  setStatusFilter,
  options,
}: Props) {
  const isFiltered = !!statusFilter;

  return (
    <div className="rounded-[14px] border border-[#e8eaf2] bg-white px-4 py-3 flex items-center gap-2.5 mb-6 w-full transition-colors duration-200">
      <Filter size={15} className="text-[#6b7280] shrink-0" />

      <span className="text-[13.5px] font-medium text-[#374151] shrink-0">
        Filter
      </span>

      <PrimarySelect
        label=""
        selectedKeys={statusFilter ? new Set([statusFilter]) : new Set()}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as string;
          setStatusFilter(value);
        }}
        className="w-[130px]"
       
        classNames={{
          base: "w-[260px] min-w-[130px]",
          trigger: isFiltered
            ? "bg-blue border  rounded-[10px] shadow-none min-h-unit-9 h-9"
            : "bg-[#f3f4f6] border border-transparent rounded-[10px] shadow-none min-h-unit-9 h-9",
          value: isFiltered
            ? "text-[13px] text-[#4f46e5] font-medium"
            : "text-[13px] text-[#374151]",
        }}
      >
        {options.map((option) => (
          <SelectItem key={option} textValue={option}>
            {option}
          </SelectItem>
        ))}
      </PrimarySelect>
    </div>
  );
}
