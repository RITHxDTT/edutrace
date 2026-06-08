"use client";

import PrimarySelect from "@/components/Selects/PrimarySelect";
import { SelectItem } from "@heroui/select";
import { TickCircle, UserSquare } from "iconsax-react";

export type StatusFilter = "all" | "handed_in" | "not_submitted";

type ClassroomOption = { classroomId: string; classroomName: string };

type Props = {
  handedIn: number;
  assigned: number;
  classrooms: ClassroomOption[];
  selectedClassroomId: string;
  statusFilter: StatusFilter;
  onClassroomChange: (id: string) => void;
  onStatusFilterChange: (filter: StatusFilter) => void;
};

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "handed_in", label: "Handed In" },
  { key: "not_submitted", label: "Not Submitted" },
];

export default function StudentWorkStats({
  handedIn,
  assigned,
  classrooms,
  selectedClassroomId,
  statusFilter,
  onClassroomChange,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[20px] bg-white px-7.5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => onStatusFilterChange(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                statusFilter === f.key
                  ? "bg-light-lavendar text-menta"
                  : "bg-input-field text-tertiary hover:bg-light-lavendar/60 hover:text-menta"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {classrooms.length > 0 && (
          <div className="w-[200px]">
            <PrimarySelect
              label=""
              placeholder="All Classes"
              selectType="secondary"
              selectedKeys={selectedClassroomId ? new Set([selectedClassroomId]) : new Set()}
              onSelectionChange={(keys) => {
                const value =
                  typeof keys === "string"
                    ? ""
                    : (Array.from(keys as Iterable<string>)[0] ?? "");
                onClassroomChange(value);
              }}
            >
              {classrooms.map((c) => (
                <SelectItem key={c.classroomId}>{c.classroomName}</SelectItem>
              ))}
            </PrimarySelect>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 rounded-[12px] border border-[lab(90.952% -.0000596046 0)] px-4 py-3">
          <div className="rounded-full bg-light-green p-2.5">
            <TickCircle size={20} color="#009F15" />
          </div>
          <div>
            <p className="text-xs text-tertiary">Handed In</p>
            <p className="text-[24px] font-semibold text-primary">{handedIn}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[12px] border border-[lab(90.952% -.0000596046 0)] px-4 py-3">
          <div className="rounded-full bg-light-lavendar p-2.5">
            <UserSquare size={20} color="#5B5EDD" />
          </div>
          <div>
            <p className="text-xs text-tertiary">Assigned</p>
            <p className="text-[24px] font-semibold text-primary">{assigned}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
