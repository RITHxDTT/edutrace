"use client";
import PrimarySelect from "@/components/Selects/PrimarySelect";
import { SelectItem } from "@heroui/select";
import { FilterIcon } from "lucide-react";

export default function FilterTask() {
  return (
    <div className="flex bg-white items-center rounded-[20px] px-7.5 py-5 gap-5">
      <div className="flex gap-2.5">
        <FilterIcon size={24} color="black" />
        <p>Filter</p>
      </div>

      <div className="w-full grid grid-cols-4 gap-5">
        <div>
          <PrimarySelect label="" placeholder="Sort By" selectType="secondary">
            <SelectItem key="">In Progress</SelectItem>
            <SelectItem key="TITLE">Title</SelectItem>
            <SelectItem key="ASSESSMENT_TYPE">Assessment Type</SelectItem>
            <SelectItem key="MAX_SCORE">Status</SelectItem>
            <SelectItem key="CREATED_DATE">Max Score</SelectItem>
            <SelectItem key="REQUIRED_DAILY_MINUTES">
              Required Daily Minutes
            </SelectItem>
          </PrimarySelect>
        </div>
        <div>
          <PrimarySelect label="" placeholder="All Status" selectType="secondary">
            <SelectItem key="">All Status</SelectItem>
            <SelectItem key="NOT_YET">Not Yet</SelectItem>
            <SelectItem key="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem key="SCHEDULED">Scheduled</SelectItem>
            <SelectItem key="CLOSED">Closed</SelectItem>
            <SelectItem key="ARCHIVED">Archived</SelectItem>
          </PrimarySelect>
        </div>
        <div>
          <PrimarySelect label="" placeholder="All Type" selectType="secondary">
            <SelectItem key="">All Type</SelectItem>
            <SelectItem key="Assigment">Assignment</SelectItem>
            <SelectItem key="IN_PROGRESS">Practice</SelectItem>
            <SelectItem key="SCHEDULED">Homework</SelectItem>
            <SelectItem key="CLOSED">Mini Project</SelectItem>
          </PrimarySelect>
        </div>
      </div>
    </div>
  );
}
