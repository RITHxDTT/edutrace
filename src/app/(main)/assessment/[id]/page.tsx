import { getAssessmentByIdAction } from "@/actions/assessment.action";
import { getMeetingRoomByAssessmentIdAction } from "@/actions/meeting.action";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import { AssessmentType } from "@/types/assessment";
import { BookOpenIcon } from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import PrimaryBreadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Calendar, Note, User } from "iconsax-react";
import { formatDateLong } from "@/utils/formatDateLong";
import InstructionDetailPage from "./_components/InstructionDetails/InstructionDetailPage";
type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function page({
  params
}: PageProps) {
  const { id } = await params;

  const result = await getMeetingRoomByAssessmentIdAction(id);
  const meetingRoomId = result?.meetingRoomId || null;


  const assessment: AssessmentType = await getAssessmentByIdAction(id);

  console.log(assessment)

  const assessmentTabs = [
    {
      key: "instruction",
      title: "Instruction",
      content: (
        <InstructionDetailPage assessment={assessment} />
      ),
    },
    {
      key: "communication",
      title: "Communication",
      content: (
        <div className="py-4">
          <p className="text-gray-600">Teacher-student communication and announcements go here.</p>
        </div>
      ),
    },
    {
      key: "student-work",
      title: "Student Work",
      content: (
        <div className="py-4">
          <p className="text-gray-600">Submitted assignments and grading overview go here.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PrimaryBreadcrumbs
        items={[
          { label: "Assessment", href: "/assessment" },
          { label: assessment.title, href: `/assessment/${id}` },
        ]}
      />
      {/* Header Info */}
      <div className="flex gap-2">
        <div className="h-fit bg-linear-purple p-5 rounded-full">
          <Note size={36} color="white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className="text-[32px] font-medium text-primary">
              {assessment.title}
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <BookOpenIcon size={18} color="black" />
              <p>Subject: <span className="font-medium">{assessment.subject.subjectName}</span></p>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            <div className="flex gap-2 items-center">
              <User size={18} color="black" />
              <p>Assigned By: <span className="font-medium">{assessment.assignedBy.fullName}</span></p>
            </div>

            <div className="w-px h-6 bg-gray-300" />


            <div className="flex gap-2 items-center">
              <Calendar size={18} color="black" />
              <p>Start: <span className="font-medium">{formatDateLong(assessment.startAt)}</span></p>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            <div className="flex gap-2 items-center">
              <Calendar size={18} color="black" />
              <p>End: <span className="font-medium">{formatDateLong(assessment.dueAt)}</span></p>
            </div>
          </div>

        </div>
      </div>

      <div className="w-full">
        <PrimaryTabs
          tabs={assessmentTabs}
          colors="primary"
        />
      </div>
    </div>
  )
}