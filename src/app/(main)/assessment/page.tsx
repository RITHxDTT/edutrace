import { getAllAssessmentAction, getAllMyAssessmentAction } from "@/actions/assessment.action";
import { auth } from "@/auth";
import AssessmentPage from "./_components/AssessmentPage";
import { getAllSubjectAction } from "@/actions/subject.action";

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth();
  const { page } = await searchParams;
  const role = session?.user?.role;
  const isTeacher = role === 'teacher';
  const currentPage = Math.max(Number(page) || 1, 1);

  console.log(session?.access_token)

  // Students get all their assessments in one batch so client-side filtering is accurate.
  // Teachers use server-side pagination normally.
  const assessmentResult = isTeacher
    ? await getAllAssessmentAction({ page: currentPage })
    : await getAllMyAssessmentAction({ page: 1, size: 100 });
  const subjects = await getAllSubjectAction();

  const assessments = "content" in assessmentResult ? assessmentResult.content : [];
  const metaData = isTeacher && "metaData" in assessmentResult ? assessmentResult.metaData : undefined;

  return (
    <AssessmentPage
      assessments={assessments}
      metaData={metaData}
      subjects={subjects}
      role={role}
    />
  );
}
