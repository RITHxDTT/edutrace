import { getAssessmentByIdAction } from "@/actions/assessment.action";
import { getMeetingRoomByAssessmentIdAction } from "@/actions/meeting.action";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import { AssessmentType } from "@/types/assessment";
import { BookOpenIcon } from "lucide-react"; // Adjust this import path based on where your tab component is saved

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

  const assessmentTabs = [
    {
      key: "instruction",
      title: "Instruction",
      content: (
        <div className="py-4">
          <p className="text-gray-600">Instruction details and materials go here.</p>
        </div>
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
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <p className="text-[32px] font-medium text-primary">
            {assessment.title}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <BookOpenIcon size={20} color="black" />
          <p>Subject: <span className="font-medium">{assessment.subject.subjectName}</span></p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Tabs Section */}
      <div className="w-full">
        <PrimaryTabs
          tabs={assessmentTabs}
          colors="primary"
        />
      </div>
    </div>
  )
}