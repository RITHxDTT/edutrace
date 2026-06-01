"use client";
import PrimarySelect from "@/components/Selects/PrimarySelect";
import { SelectItem } from "@heroui/select";
import { FilterIcon } from "lucide-react";

type FilterState = {
  sortBy: string;
  status: string;
  type: string;
};

type FilterTaskProps = {
  onFilterChange: (filters: FilterState) => void;
};

export default function FilterTask({ onFilterChange }: FilterTaskProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ sortBy: "", status: "", type: "", [key]: value });
  };

  return (
    <div className="flex bg-white items-center rounded-[20px] px-7.5 py-5 gap-5">
      <div className="flex gap-2.5">
        <FilterIcon size={24} color="black" />
        <p>Filter</p>
      </div>

      <div className="w-full grid grid-cols-4 gap-5">
        <div>
          <PrimarySelect
            label=""
            placeholder="Sort By"
            selectType="secondary"
            onChange={(e) => handleChange("sortBy", e.target.value)}
          >
            <SelectItem key="TITLE">Title</SelectItem>
            <SelectItem key="ASSESSMENT_TYPE">Assessment Type</SelectItem>
            <SelectItem key="STATUS">Status</SelectItem>
            <SelectItem key="MAX_SCORE">Max Score</SelectItem>
            <SelectItem key="CREATED_DATE">Created Date</SelectItem>
          </PrimarySelect>
        </div>
        <div>
          <PrimarySelect
            label=""
            placeholder="All Status"
            selectType="secondary"
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <SelectItem key="">All Status</SelectItem>
            <SelectItem key="NOT_YET">Not Yet</SelectItem>
            <SelectItem key="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem key="SCHEDULED">Scheduled</SelectItem>
            <SelectItem key="CLOSED">Closed</SelectItem>
            <SelectItem key="ARCHIVED">Archived</SelectItem>
          </PrimarySelect>
        </div>
        <div>
          <PrimarySelect
            label=""
            placeholder="All Type"
            selectType="secondary"
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <SelectItem key="">All Type</SelectItem>
            <SelectItem key="ASSIGNMENT">Assignment</SelectItem>
            <SelectItem key="PRACTICE">Practice</SelectItem>
            <SelectItem key="HOMEWORK">Homework</SelectItem>
            <SelectItem key="MINI_PROJECT">Mini Project</SelectItem>
          </PrimarySelect>
        </div>
      </div>
    </div>
  );
}