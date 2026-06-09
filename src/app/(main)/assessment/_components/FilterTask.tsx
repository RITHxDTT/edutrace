"use client";
import PrimarySelect from "@/components/Selects/PrimarySelect";
import { SubjectType } from "@/types/subject";
import { SelectItem } from "@heroui/select";
import { FilterIcon } from "lucide-react";
import { useSession } from "next-auth/react";

type FilterState = {
  status: string;
  subject: string;
  sortBy: string;
};

type FilterTaskProps = {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  subjects: SubjectType[];
};

export default function FilterTask({
  filters,
  subjects,
  onFilterChange,
}: FilterTaskProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;

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
            placeholder="All Status"
            selectType="secondary"
            selectedKeys={[filters.status]}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <SelectItem key="">All Status</SelectItem>
            <SelectItem key="NOT_YET">Not Yet</SelectItem>
            <SelectItem key="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem key="SCHEDULED">Scheduled</SelectItem>
            <SelectItem key="CLOSED">Closed</SelectItem>
            <SelectItem key="ARCHIVED">Archived</SelectItem>
          </PrimarySelect>
        </div>
        {role === "student" && (
          <div>
            <PrimarySelect
              label=""
              placeholder="All Subjects"
              selectType="secondary"
              selectedKeys={[filters.subject]}
              onChange={(e) => onFilterChange("subject", e.target.value)}
            >
              <>
                <SelectItem key="">All Subject</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.subjectId}>
                    {subject.subjectName}
                  </SelectItem>
                ))}
              </>
            </PrimarySelect>
          </div>
        )}
      </div>
    </div>
  );
}
