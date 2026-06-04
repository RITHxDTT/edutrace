"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAssessmentWorkSessionsAction,
  getSubmissionByIdAction,
} from "@/actions/assessment.action";
import { getUserByIdAction } from "@/actions/user.action";
import {
  AssessmentSubmission,
  AssessmentSubmissionPayload,
  AssessmentType,
  WorkSession,
  WorkSessionPayload,
} from "@/types/assessment";
import { ClassroomProps, ClassroomType } from "@/types/classroom";
import { UserProfile } from "@/types/user";
import StudentSubmissionCard from "./StudentSubmissionCard";
import StudentWorkStats from "./StudentWorkStats";
import SubmissionDetailDrawer from "./SubmissionDetailDrawer";

type SubmissionData = AssessmentSubmissionPayload | AssessmentSubmission[] | undefined;

type Props = {
  assessment: AssessmentType;
  submissions?: SubmissionData;
  classrooms: ClassroomType[];
};

function normalizeSubmissions(
  assessment: AssessmentType,
  submissions?: SubmissionData,
) {
  if (Array.isArray(submissions)) return submissions;
  return submissions?.content ?? assessment.studentWorks ?? [];
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

function isSubmittedStatus(status?: string) {
  const s = status?.trim().toUpperCase();
  return s === "SUBMITTED" || s === "RESUBMITTED" || s === "GRADED";
}

function deduplicateByStudent(submissions: AssessmentSubmission[]): AssessmentSubmission[] {
  const latestByStudent = new Map<string, AssessmentSubmission>();

  for (const submission of submissions) {
    const key = submission.student?.userId ?? submission.student?.fullName ?? submission.submissionId;
    const existing = latestByStudent.get(key);

    if (
      !existing ||
      new Date(submission.submittedAt ?? 0) > new Date(existing.submittedAt ?? 0)
    ) {
      latestByStudent.set(key, submission);
    }
  }
  return Array.from(latestByStudent.values());
}

function normalizeWorkSessions(data: WorkSessionPayload | WorkSession[] | undefined) {
  if (Array.isArray(data)) return data;
  return data?.content ?? [];
}

function normalizedClassroom(submissions: AssessmentSubmission[]): ClassroomType[] {
  const classroomMap = new Map<string, ClassroomType>();
  for (const submission of submissions) {
    const key = submission.student?.userId ?? submission.student?.fullName ?? submission.submissionId;
    classroomMap.set(key, submission?.student?.classroom as ClassroomType);
  }
  return Array.from(classroomMap.values());
}

function getStudentWorkSessions(
  sessions: WorkSession[],
  submission: AssessmentSubmission,
) {
  return sessions.filter((session) => {
    if (submission.student?.userId && session.userId === submission.student?.userId) {
      return true;
    }

    if (submission.student?.fullName && session.studentName === submission.student.fullName) {
      return true;
    }

    return false;
  });
}

export default function StudentWorkPage({ assessment, submissions }: Props) {

  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<AssessmentSubmission | null>(null);
  const [profileByUserId, setProfileByUserId] = useState<
    Record<string, UserProfile | null>
  >({});
  const [submissionDetailById, setSubmissionDetailById] = useState<
    Record<string, AssessmentSubmission>
  >({});
  const [workSessionsBySubmissionId, setWorkSessionsBySubmissionId] = useState<
    Record<string, WorkSession[]>
  >({});
  const [loadingSubmissionId, setLoadingSubmissionId] = useState<string | null>(null);
  const [submissionDetailError, setSubmissionDetailError] = useState<string | null>(null);

  const submissionList = useMemo(
    () => normalizeSubmissions(assessment, submissions),
    [assessment, submissions],
  );

  const filteredSubmissions = useMemo(() => {
    if (!selectedClassroomId) return submissionList;
    return submissionList;
  }, [selectedClassroomId, submissionList]);

  const classrooms = useMemo(() => normalizedClassroom(submissionList), [submissionList])

  const backendHandedIn = getBackendCount(submissions, "handedIn");
  const backendAssigned = getBackendCount(submissions, "assigned") ?? assessment.totalAssigned;
  const handedIn = selectedClassroomId
    ? filteredSubmissions.filter((a) => isSubmittedStatus(a.status)).length
    : backendHandedIn ?? filteredSubmissions.filter((a) => a.status === "SUBMITTED").length;
  const assigned = selectedClassroomId ? filteredSubmissions.length : backendAssigned ?? filteredSubmissions.length;

  const selectedSubmissionDetail = selectedSubmission
    ? submissionDetailById[selectedSubmission.submissionId] ?? selectedSubmission
    : null;
  const selectedSubmissionWithSessions =
    selectedSubmissionDetail && selectedSubmission
      ? {
        ...selectedSubmissionDetail,
        workSessions:
          workSessionsBySubmissionId[selectedSubmission.submissionId] ??
          selectedSubmissionDetail.workSessions,
      }
      : null;

  useEffect(() => {
    const missingUserIds = Array.from(
      new Set(
        submissionList
          .map((submission) => submission.student?.userId)
          .filter((studentId): studentId is string => !!studentId && !(studentId in profileByUserId)),
      )
    );

    if (missingUserIds.length === 0) return;

    let ignore = false;

    Promise.all(
      missingUserIds.map(async (userId) => {
        const result = await getUserByIdAction(userId);
        return {
          userId,
          profile: result.success ? result.data as UserProfile : null,
        };
      }),
    ).then((profiles) => {
      if (ignore) return;

      setProfileByUserId((prev) => {
        const next = { ...prev };
        profiles.forEach(({ userId, profile }) => {
          next[userId] = profile;
        });
        return next;
      });
    });

    return () => {
      ignore = true;
    };
  }, [profileByUserId, submissionList]);

  const handleSelectSubmission = async (submission: AssessmentSubmission) => {
    setSelectedSubmission(submission);
    setSubmissionDetailError(null);

    if (
      submissionDetailById[submission.submissionId] &&
      workSessionsBySubmissionId[submission.submissionId]
    ) {
      return;
    }

    setLoadingSubmissionId(submission.submissionId);
    const [submissionResult, workSessionsResult] = await Promise.all([
      submissionDetailById[submission.submissionId]
        ? Promise.resolve({
          success: true,
          data: submissionDetailById[submission.submissionId],
          error: undefined,
        })
        : getSubmissionByIdAction(submission.submissionId),
      workSessionsBySubmissionId[submission.submissionId]
        ? Promise.resolve({
          success: true,
          data: {
            content: workSessionsBySubmissionId[submission.submissionId],
          },
          error: undefined,
        })
        : getAssessmentWorkSessionsAction(assessment.assessmentId),
    ]);

    const studentWorkSessions = workSessionsResult.success
      ? getStudentWorkSessions(normalizeWorkSessions(workSessionsResult.data), submission)
      : [];

    if (submissionResult.success) {
      setSubmissionDetailById((prev) => ({
        ...prev,
        [submission.submissionId]: {
          ...submission,
          ...submissionResult.data,
          workSessions: studentWorkSessions,
        } as AssessmentSubmission,
      }));
    } else {
      setSubmissionDetailError(
        submissionResult.error || "Failed to load submission details.",
      );
    }

    if (workSessionsResult.success) {
      setWorkSessionsBySubmissionId((prev) => ({
        ...prev,
        [submission.submissionId]: studentWorkSessions,
      }));
    } else {
      setSubmissionDetailError(
        workSessionsResult.error || "Failed to load work sessions.",
      );
    }

    setLoadingSubmissionId(null);
  };


  const handleSubmissionChange = (submission: AssessmentSubmission) => {
    setSelectedSubmission(submission);
    setSubmissionDetailById((prev) => ({
      ...prev,
      [submission.submissionId]: submission,
    }));
  };


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
        {(() => {
          const submitted = deduplicateByStudent(
            filteredSubmissions.filter((a) => a.status === "SUBMITTED" || a.status === "GRADED"),
          );

          if (submitted.length === 0) {
            return (
              <div className="col-span-3 rounded-[20px] bg-white px-7.5 py-10 text-center text-tertiary">
                No submitted work for this class yet.
              </div>
            );
          }

          return submitted.map((submission) => {
            return (
              <StudentSubmissionCard
                key={submission.submissionId}
                submission={submission}
                profileImageUrl={
                  submission.student?.profileImageUrl
                }
                isSelected={selectedSubmission?.submissionId === submission.submissionId}
                onClick={() => {
                  void handleSelectSubmission(submission);
                }}
              />
            )
          });
        })()}
      </div>

      <SubmissionDetailDrawer
        submission={selectedSubmissionWithSessions}
        profileImageUrl={
          selectedSubmissionWithSessions?.student?.profileImageUrl
        }
        isLoading={
          !!selectedSubmission &&
          loadingSubmissionId === selectedSubmission.submissionId
        }
        error={submissionDetailError}
        onSubmissionChange={handleSubmissionChange}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
}
