"use client";

import { useMemo, useState } from "react";
import {
  getAssessmentWorkSessionsAction,
  getSubmissionByIdAction,
} from "@/actions/assessment.action";
import {
  AssessmentType,
  SubmissionDetail,
  SubmittedStudent,
  UnsubmittedStudent,
  StudentWork,
  WorkSession,
} from "@/types/assessment";
import StudentSubmissionCard from "./StudentSubmissionCard";
import StudentWorkStats, { StatusFilter } from "./StudentWorkStats";
import SubmissionDetailDrawer from "./SubmissionDetailDrawer";

type AnyStudent = SubmittedStudent | UnsubmittedStudent;

type Props = {
  assessment: AssessmentType;
};

export default function StudentWorkPage({ assessment }: Props) {
  const studentWorks = assessment.studentWorks ?? [];

  const [selectedStudent, setSelectedStudent] = useState<AnyStudent | null>(null);
  const [studentDetailByUserId, setStudentDetailByUserId] = useState<
    Record<string, SubmissionDetail>
  >({});
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [submissionDetailError, setSubmissionDetailError] = useState<string | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const classrooms = useMemo(
    () =>
      studentWorks.map((sw) => ({
        classroomId: sw.classroomId,
        classroomName: sw.classroomName,
      })),
    [studentWorks],
  );

  const filteredWorks = useMemo(
    () =>
      selectedClassroomId
        ? studentWorks.filter((sw) => sw.classroomId === selectedClassroomId)
        : studentWorks,
    [studentWorks, selectedClassroomId],
  );

  const handedIn = filteredWorks.reduce((sum, sw) => sum + sw.submittedCount, 0);
  const assigned = filteredWorks.reduce(
    (sum, sw) => sum + sw.submittedCount + sw.unsubmittedCount,
    0,
  );

  const studentItems = useMemo(() => {
    const submitted = filteredWorks.flatMap((sw) =>
      sw.submittedStudents.map((student) => ({ student: student as AnyStudent, work: sw })),
    );
    const unsubmitted = filteredWorks.flatMap((sw) =>
      sw.unsubmittedStudents.map((student) => ({ student: student as AnyStudent, work: sw })),
    );

    if (statusFilter === "handed_in") return submitted;
    if (statusFilter === "not_submitted") return unsubmitted;
    return [...submitted, ...unsubmitted];
  }, [filteredWorks, statusFilter]);

  const selectedDetail = selectedStudent
    ? (studentDetailByUserId[selectedStudent.userId] ?? null)
    : null;

  const handleSelectStudent = async (student: AnyStudent, work: StudentWork) => {
    setSelectedStudent(student);
    setSubmissionDetailError(null);

    const userId = student.userId;

    const baseDetail: SubmissionDetail = {
      submissionId: student.latestSubmission?.submissionId ?? "",
      status: student.latestSubmission?.status ?? "",
      submittedAt: student.latestSubmission?.submittedAt ?? "",
      isResubmission: student.latestSubmission?.isResubmission ?? false,
      submissionResources: student.latestSubmission?.submissionResources,
      student: {
        userId: student.userId,
        fullName: student.fullName,
        profileImageUrl: student.profileImageUrl ?? undefined,
        classroom: {
          classroomId: work.classroomId,
          className: work.classroomName,
          classroomAbbre: work.classroomName,
        },
      },
      totalTimeSpentMinutes: student.learningProgress.totalTimeSpentMinutes,
      timeSpentTodayMinutes: student.learningProgress.timeSpentTodayMinutes,
      remainingDailyMinutes: student.learningProgress.remainingDailyMinutes,
    };

    setStudentDetailByUserId((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], ...baseDetail },
    }));

    if (studentDetailByUserId[userId]?.workSessions !== undefined) return;

    setLoadingUserId(userId);

    const submissionId = student.latestSubmission?.submissionId;

    const [submissionResult, workSessionsResult] = await Promise.all([
      submissionId ? getSubmissionByIdAction(submissionId) : Promise.resolve(null),
      getAssessmentWorkSessionsAction(assessment.assessmentId),
    ]);

    const allSessions: WorkSession[] = workSessionsResult.success
      ? Array.isArray(workSessionsResult.data)
        ? workSessionsResult.data
        : (workSessionsResult.data?.content ?? [])
      : [];
    const studentSessions = allSessions.filter((s) => s.userId === userId);

    if (submissionResult?.success) {
      setStudentDetailByUserId((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          ...(submissionResult.data as Partial<SubmissionDetail>),
          workSessions: studentSessions,
        },
      }));
    } else {
      if (submissionResult && !submissionResult.success) {
        setSubmissionDetailError(
          submissionResult.error || "Failed to load submission details.",
        );
      }
      setStudentDetailByUserId((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], workSessions: studentSessions },
      }));
    }

    setLoadingUserId(null);
  };

  const handleSubmissionChange = (detail: SubmissionDetail) => {
    if (!selectedStudent) return;
    setStudentDetailByUserId((prev) => ({
      ...prev,
      [selectedStudent.userId]: detail,
    }));
  };

  return (
    <div className="flex flex-col gap-5 py-4">
      <StudentWorkStats
        handedIn={handedIn}
        assigned={assigned}
        classrooms={classrooms}
        selectedClassroomId={selectedClassroomId}
        statusFilter={statusFilter}
        onClassroomChange={(id) => {
          setSelectedClassroomId(id);
          setSelectedStudent(null);
        }}
        onStatusFilterChange={(f) => {
          setStatusFilter(f);
          setSelectedStudent(null);
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {studentItems.length === 0 ? (
          <div className="col-span-3 rounded-[20px] bg-white px-7.5 py-10 text-center text-tertiary">
            No students match the current filter.
          </div>
        ) : (
          studentItems.map(({ student, work }) => (
            <StudentSubmissionCard
              key={student.userId}
              student={student}
              classroomName={work.classroomName}
              isSelected={selectedStudent?.userId === student.userId}
              onClick={() => void handleSelectStudent(student, work)}
            />
          ))
        )}
      </div>

      <SubmissionDetailDrawer
        submission={selectedDetail}
        isLoading={!!selectedStudent && loadingUserId === selectedStudent.userId}
        error={submissionDetailError}
        onSubmissionChange={handleSubmissionChange}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
