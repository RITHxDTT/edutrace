import {
  getAssessmentByIdAction,
  getAssessmentSubmissionsAction,
  getMyAssessmentsAction,
  getMyWorkSessionsAction,
} from "@/actions/assessment.action";
import { getAllSubjectAction } from "@/actions/subject.action";
import { auth } from "@/auth";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";

import { BookOpenIcon } from "lucide-react";
import CommunicationRoom from "../communication/[id]/_components/CommunicationRoom";

import {
  AssessmentSubmission,
  AssessmentSubmissionPayload,
  AssessmentType,
  WorkSession,
  WorkSessionPayload,
} from "@/types/assessment";
import { SubjectType } from "@/types/subject";

import PrimaryBreadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Calendar, Note, User } from "iconsax-react";
import { formatDateLong } from "@/utils/formatDateLong";
import InstructionDetailPage from "./_components/InstructionDetails/InstructionDetailPage";
import AssessmentHeaderActions from "./_components/AssessmentHeaderActions";
import StudentWorkPage from "./_components/StudentWork/StudentWorkPage";
import StudentAssessmentTabs from "./_components/StudentAssessmentTabs";
import { getMeetingRoomByAssessmentIdAction } from "@/actions/meeting.action";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type SubmissionData =
  | AssessmentSubmissionPayload
  | AssessmentSubmission[]
  | undefined;

type WorkSessionData = WorkSessionPayload | WorkSession[] | undefined;

type MyAssessmentData =
  | AssessmentType[]
  | { content?: AssessmentType[] }
  | undefined;

type MeetingRoomResult = {
  meetingRoomId?: string;
} | null | undefined;

function normalizeMyAssessments(assessments: MyAssessmentData) {
  if (Array.isArray(assessments)) return assessments;
  return assessments?.content ?? [];
}

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  const meetingRoomResult = (await getMeetingRoomByAssessmentIdAction(
    id,
  )) as MeetingRoomResult;

  const meetingRoomId = meetingRoomResult?.meetingRoomId;

  const [assessmentResult, subjects, submissions, workSessions, myAssessments] =
    (await Promise.all([
      getAssessmentByIdAction(id),
      isTeacher ? getAllSubjectAction() : Promise.resolve([]),
      isTeacher ? getAssessmentSubmissionsAction(id) : Promise.resolve(undefined),
      isStudent ? getMyWorkSessionsAction(id) : Promise.resolve(undefined),
      isStudent ? getMyAssessmentsAction() : Promise.resolve(undefined),
    ])) as [
      AssessmentType,
      SubjectType[],
      SubmissionData,
      WorkSessionData,
      MyAssessmentData,
    ];

  const myAssessment = normalizeMyAssessments(myAssessments).find(
    (item) => item.assessmentId === id,
  );

  const assessment = myAssessment ?? assessmentResult;

  const instructionContent = <InstructionDetailPage assessment={assessment} />;

  const communicationContent = (
    <div className="py-4">
      {meetingRoomId ? (
        <CommunicationRoom meetingRoomId={meetingRoomId} />
      ) : (
        <p className="text-gray-600">
          No communication room available for this assessment.
        </p>
      )}
    </div>
  );

  console.log(session?.access_token);

  const assessmentTabs = [
    {
      key: "instruction",
      title: "Instruction",
      content: instructionContent,
    },
    {
      key: "communication",
      title: "Communication",
      content: (
        <div className="py-4">
          {meetingRoomId ? (
            <CommunicationRoom meetingRoomId={meetingRoomId} />
          ) : (
            <p className="text-gray-600">
              No communication room available for this assessment.
            </p>
          )}
        </div>
      ),
    },
    {
      key: "student-work",
      title: "Student Work",
      content: (
        <StudentWorkPage
          assessment={assessment}
          submissions={submissions}
        />
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
      <div className="flex items-start justify-between gap-4">
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
                <p>
                  Subject:{" "}
                  <span className="font-medium">
                    {assessment.subject?.subjectName ?? "N/A"}
                  </span>
                </p>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              <div className="flex gap-2 items-center">
                <User size={18} color="black" />
                <p>
                  Assigned By:{" "}
                  <span className="font-medium">
                    {assessment.assignedBy?.fullName ?? "N/A"}
                  </span>
                </p>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              <div className="flex gap-2 items-center">
                <Calendar size={18} color="black" />
                <p>
                  Start:{" "}
                  <span className="font-medium">
                    {formatDateLong(assessment.startAt)}
                  </span>
                </p>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              <div className="flex gap-2 items-center">
                <Calendar size={18} color="black" />
                <p>
                  End:{" "}
                  <span className="font-medium">
                    {formatDateLong(assessment.dueAt)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {isTeacher && (
          <AssessmentHeaderActions
            assessment={assessment}
            assessmentId={id}
            subjects={subjects}
          />
        )}
      </div>

      <div className="w-full">
        {isStudent ? (
          <StudentAssessmentTabs
            assessment={assessment}
            instruction={instructionContent}
            communication={communicationContent}
            workSessions={workSessions}
          />
        ) : (
          <PrimaryTabs tabs={assessmentTabs} colors="primary" />
        )}
      </div>
    </div>
  );
}