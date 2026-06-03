"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CreateAssessmentModal from "../../_components/CreateAssessmentModal/CreateAssessmentModal";
import { AssessmentType } from "@/types/assessment";
import { ClassroomProps, ClassroomType } from "@/types/classroom";
import { SubjectType } from "@/types/subject";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
  assessmentId: string;
  assessment: AssessmentType;
  subjects: SubjectType[];
};

type SessionClassroom = ClassroomType | ClassroomProps | string;
type SessionClassrooms = SessionClassroom[] | undefined;

function normalizeClassrooms(classrooms: SessionClassrooms): ClassroomType[] {
  if (!classrooms) return [];

  return classrooms.flatMap((item) => {
    if (typeof item === "string") {
      return {
        classroomId: item,
        className: item,
        classroomAbbre: item,
      };
    }

    return "classrooms" in item ? item.classrooms : item;
  });
}

export default function AssessmentHeaderActions({
  assessmentId,
  assessment,
  subjects,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();
  const taughtClassrooms = normalizeClassrooms(session.data?.user?.taughtClassrooms);

  const handleEdit = () => {
    setOpen(false);
    setIsEditOpen(true);
  };

  const handleDelete = () => {
    setOpen(false);
    window.confirm("Delete assessment is not connected yet.");
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${pathname}`;

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-transparent text-primary transition hover:bg-input-field"
          aria-label="Assessment actions"
        >
          <MoreHorizontal size={20} />
        </PopoverTrigger>

        <PopoverContent align="end" sideOffset={8} className="w-[180px] gap-1 rounded-[10px] bg-white p-1.5">
          <button
            type="button"
            onClick={handleEdit}
            className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-sm font-medium text-primary hover:bg-input-field"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-sm font-medium text-error hover:bg-[#FCD3D3]"
          >
            <Trash2 size={16} />
            Delete
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-sm font-medium text-primary hover:bg-input-field"
          >
            <Copy size={16} />
            {copied ? "Copied" : "Copy Link"}
          </button>
        </PopoverContent>
      </Popover>

      {isEditOpen && (
        <CreateAssessmentModal
          key={`${assessmentId}-${taughtClassrooms.map((classroom) => classroom.classroomId).join("-")}`}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          subjects={subjects}
          taughtClassrooms={taughtClassrooms}
          assessment={assessment}
          assessmentId={assessmentId}
          mode="edit"
        />  
      )}
    </>
  );
}
