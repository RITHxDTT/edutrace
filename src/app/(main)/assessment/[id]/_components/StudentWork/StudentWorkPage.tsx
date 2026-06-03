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
import { ClassroomType } from "@/types/classroom";
import { UserProfile } from "@/types/user";
import StudentSubmissionCard from "./StudentSubmissionCard";
import StudentWorkStats from "./StudentWorkStats";
import SubmissionDetailDrawer from "./SubmissionDetailDrawer";
import { useSession } from "next-auth/react";

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

function normalizeWorkSessions(data: WorkSessionPayload | WorkSession[] | undefined) {
  if (Array.isArray(data)) return data;
  return data?.content ?? [];
}

function getStudentWorkSessions(
  sessions: WorkSession[],
  submission: AssessmentSubmission,
) {
  return sessions.filter((session) => {
    if (submission.studentId && session.userId === submission.studentId) {
      return true;
    }

    if (submission.studentName && session.studentName === submission.studentName) {
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
          .map((submission) => submission.studentId)
          .filter((studentId): studentId is string => !!studentId && !(studentId in profileByUserId)),
      ),
    );

    if (missingUserIds.length === 0) return;

    let ignore = false;

    Promise.all(
missingUserIds.map(async (userId) => {
  console.log('calling getUserByIdAction with userId:', userId);
  const result = await getUserByIdAction(userId);
  console.log('getUserByIdAction result:', result);
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
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            <StudentSubmissionCard
              key={submission.submissionId}
              submission={submission}
              profileImageUrl={
                submission.studentId
                  ? profileByUserId[submission.studentId]?.profileImageUrl
                  : undefined
              }
              isSelected={selectedSubmission?.submissionId === submission.submissionId}
              onClick={() => {
                void handleSelectSubmission(submission);
              }}
            />
          ))
        ) : (
          <div className="col-span-3 rounded-[20px] bg-white px-7.5 py-10 text-center text-tertiary">
            No submitted work for this class yet.
          </div>
        )}
      </div>

      <SubmissionDetailDrawer
        submission={selectedSubmissionWithSessions}
        profileImageUrl={
          selectedSubmissionWithSessions?.studentId
            ? profileByUserId[selectedSubmissionWithSessions.studentId]?.profileImageUrl
            : undefined
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
