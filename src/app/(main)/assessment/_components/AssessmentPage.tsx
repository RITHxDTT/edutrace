"use client";
import { useState } from "react";
import NavbarTitle from "@/components/Topbar/NavbarTitle";
import FilterTask from "./FilterTask";
import AssessmentList from "./AssessmentList";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { AssessmentType } from "@/types/assessment";
import { SubjectType } from "@/types/subject";
import CreateAssessmentModal from "./CreateAssessmentModal/CreateAssessmentModal";
import { useDisclosure } from "@heroui/modal";
import { useSession } from "next-auth/react";
import { ClassroomProps, ClassroomType } from "@/types/classroom";
import { Pagination } from "@heroui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AssessmentMetaData } from "@/types/assessment";

type FilterState = {
  subject: string;
  status: string;
  sortBy: string;
};

type Props = {
  assessments: AssessmentType[];
  metaData?: AssessmentMetaData;
  subjects: SubjectType[];
  role?: string;
  taughtClassrooms?: ClassroomType[] | ClassroomProps[];
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

export default function AssessmentPage({ assessments, metaData, role, subjects }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    subject: "",
    status: "",
    sortBy: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const session = useSession();
  const totalPages = Math.max(metaData?.totalPage ?? 1, 1);
  const pageFromUrl = Math.max(Number(searchParams.get("page")) || 1, 1);
  const currentPage = Math.min(pageFromUrl, totalPages);

  const classroomsTaught =
    role === "teacher" ? normalizeClassrooms(session?.data?.user?.taughtClassrooms) : [];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const filtered = assessments
    .filter((a) => (filters.status ? a.status === filters.status : true))
    .filter((a) =>
      filters.subject ? a.subject.subjectId === filters.subject : true,
    )
    .sort((a, b) => {
      if (filters.sortBy === "STATUS") return a.status.localeCompare(b.status);
      return 0;
    });

  return (
    <div className="flex flex-col gap-5 p-5">
      <NavbarTitle title="Assessment" override />

      <div className="w-full flex items-center justify-between">
        <div>
          <p className="text-[24px] font-semibold">Assessment</p>
          <p>Manage assessments, deadlines, and progress</p>
        </div>
        {role === "teacher" && (
          <>
            <div>
              <PrimaryButton size={"md"} onClick={onOpen}>Create Assessment</PrimaryButton>
            </div>

            <CreateAssessmentModal
              isOpen={isOpen}
              onClose={onClose}
              subjects={subjects}
              taughtClassrooms={classroomsTaught ?? []}
            />
          </>
        )}
      </div>

      <FilterTask
        filters={filters}
        onFilterChange={handleFilterChange}
        subjects={subjects}
      />

      <AssessmentList assessments={filtered} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-[20px] bg-white px-7.5 py-4">
          <p className="text-sm text-tertiary">
            Page <span className="font-semibold text-primary">{currentPage}</span> of{" "}
            <span className="font-semibold text-primary">{totalPages}</span>
          </p>

          <Pagination
            showControls
            page={currentPage}
            total={totalPages}
            onChange={handlePageChange}
            classNames={{
              cursor: "bg-linear-purple text-white",
            }}
          />
        </div>
      )}
    
    </div>
  );
}
