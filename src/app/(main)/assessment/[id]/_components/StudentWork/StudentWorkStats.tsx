import PrimarySelect from "@/components/Selects/PrimarySelect";
import { ClassroomType } from "@/types/classroom";
import { SelectItem } from "@heroui/select";
import { FilterIcon } from "lucide-react";
import { TickCircle, UserSquare } from "iconsax-react";

type Props = {
  classrooms: ClassroomType[];
  selectedClassroomId: string;
  handedIn: number;
  assigned: number;
  onClassroomChange: (classroomId: string) => void;
};

export default function StudentWorkStats({
  classrooms,
  selectedClassroomId,
  handedIn,
  assigned,
  onClassroomChange,
}: Props) {
  return (
    <div className="grid grid-cols-[1fr_220px_220px] items-center gap-5 rounded-[20px] bg-white px-7.5 py-5">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <FilterIcon size={24} color="black" />
          <p>Filter</p>
        </div>

        <div className="w-[260px]">
          <PrimarySelect
            label=""
            placeholder="All Classes"
            selectType="secondary"
            selectedKeys={[selectedClassroomId]}
            onChange={(event) => onClassroomChange(event.target.value)}
          >
            <>
              <SelectItem key="">All Classes</SelectItem>
              {classrooms.map((classroom) => (
                <SelectItem key={classroom.classroomId}>
                  {classroom.className || classroom.classroomAbbre}
                </SelectItem>
              ))}
            </>
          </PrimarySelect>
        </div>
      </div>

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
  );
}
