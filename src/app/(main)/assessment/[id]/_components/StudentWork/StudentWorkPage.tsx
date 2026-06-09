"use client";

import { useMemo, useState } from "react";
import {
  AssessmentSubmission,
  AssessmentSubmissionPayload,
  AssessmentType,
} from "@/types/assessment";
import { ClassroomType } from "@/types/classroom";
import StudentSubmissionCard from "./StudentSubmissionCard";
import StudentWorkStats from "./StudentWorkStats";
import SubmissionDetailDrawer from "./SubmissionDetailDrawer";

type SubmissionData = AssessmentSubmissionPayload | AssessmentSubmission[] | undefined;

type Props = {
  assessment: AssessmentType;
  submissions?: SubmissionData;
};

function normalizeSubmissions(
  assessment: AssessmentType,
  submissions?: SubmissionData,
) {
  if (Array.isArray(submissions)) return submissions;
  return submissions?.content ?? assessment.studentWorks ?? [];
}

function normalizeClassrooms(assessment: AssessmentType, submissions: AssessmentSubmission[]) {
  const classroomMap = new Map<string, ClassroomType>();

  assessment.classrooms?.forEach((classroom) => {
    classroomMap.set(classroom.classroomId, {
      classroomId: classroom.classroomId,
      className: classroom.className ?? classroom.classroomAbbre ?? "Classroom",
      classroomAbbre: classroom.classroomAbbre ?? classroom.className ?? "Class",
    });
  });

  submissions.forEach((submission) => {
    if (!submission.classroomId) return;

    classroomMap.set(submission.classroomId, {
      classroomId: submission.classroomId,
      className: submission.classroomName ?? submission.classroomAbbre ?? "Classroom",
      classroomAbbre: submission.classroomAbbre ?? submission.classroomName ?? "Class",
    });
  });

  return Array.from(classroomMap.values());
}

function getBackendCount(
  submissions: SubmissionData,
  key: "handedIn" | "assigned",
) {
  if (Array.isArray(submissions) || !submissions) return undefined;

  if (key === "handedIn") {
    return submissions.totalHandedIn ?? submissions.handedIn;
  }

  return submissions.totalAssigned ?? submissions.assigned;
}

export default function StudentWorkPage({ assessment, submissions }: Props) {
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<AssessmentSubmission | null>(null);

  const submissionList = useMemo(
    () => normalizeSubmissions(assessment, submissions),
    [assessment, submissions],
  );

  const classrooms = useMemo(
    () => normalizeClassrooms(assessment, submissionList),
    [assessment, submissionList],
  );

  const filteredSubmissions = useMemo(() => {
    if (!selectedClassroomId) return submissionList;
    return submissionList.filter(
      (submission) => submission.classroomId === selectedClassroomId,
    );
  }, [selectedClassroomId, submissionList]);

  const backendHandedIn = getBackendCount(submissions, "handedIn");
  const backendAssigned = getBackendCount(submissions, "assigned") ?? assessment.totalAssigned;
  const handedIn = selectedClassroomId ? filteredSubmissions.length : backendHandedIn ?? filteredSubmissions.length;
  const assigned = selectedClassroomId ? filteredSubmissions.length : backendAssigned ?? filteredSubmissions.length;

  return (
    <div className="flex flex-col gap-5 py-4">
      <StudentWorkStats
        classrooms={classrooms}
        selectedClassroomId={selectedClassroomId}
        handedIn={handedIn}
        assigned={assigned}
        onClassroomChange={(classroomId) => {
          setSelectedClassroomId(classroomId);
          setSelectedSubmission(null);
        }}
      />

      <div className="grid grid-cols-3 gap-5">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            <StudentSubmissionCard
              key={submission.submissionId}
              submission={submission}
              isSelected={selectedSubmission?.submissionId === submission.submissionId}
              onClick={() => setSelectedSubmission(submission)}
            />
          ))
        ) : (
          <div className="col-span-3 rounded-[20px] bg-white px-7.5 py-10 text-center text-tertiary">
            No submitted work for this class yet.
          </div>
        )}
      </div>

      <SubmissionDetailDrawer
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
}
