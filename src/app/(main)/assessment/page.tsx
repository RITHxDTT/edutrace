import { getAllAssessmentAction, getAllMyAssessmentAction } from "@/actions/assessment.action";
import { auth } from "@/auth";
import AssessmentPage from "./_components/AssessmentPage";
import { getAllSubjectAction } from "@/actions/subject.action";
import { GetAssessmentParams } from "@/types/assessment";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    sortBy?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth();
  const { page, status, sortBy } = await searchParams;
  const role = session?.user?.role;
  const isTeacher = role === 'teacher';
  const currentPage = Math.max(Number(page) || 1, 1);

  const assessmentResult = isTeacher
    ? await getAllAssessmentAction({ page: currentPage, status: status as GetAssessmentParams["status"], sortBy })
    : await getAllMyAssessmentAction({ page: 1, size: 100 });
  const subjects = await getAllSubjectAction();

  const assessments = "content" in assessmentResult ? assessmentResult.content : [];
  const metaData = isTeacher && "metaData" in assessmentResult ? assessmentResult.metaData : undefined;
  console.log(assessments)

  return (
    <AssessmentPage
      assessments={assessments}
      metaData={metaData}
      subjects={subjects}
      role={role}
    />
  );
}
