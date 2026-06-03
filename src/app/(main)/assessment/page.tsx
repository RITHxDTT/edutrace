import { getAllAssessmentAction } from "@/actions/assessment.action";
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
  const currentPage = Math.max(Number(page) || 1, 1);

  const role = session?.user?.role;
  const assessmentResult = await getAllAssessmentAction({ page: currentPage });
  const subjects = await getAllSubjectAction();

  const assessments = "content" in assessmentResult ? assessmentResult.content : [];
  const metaData = "metaData" in assessmentResult ? assessmentResult.metaData : undefined;

  return (
    <AssessmentPage
      assessments={assessments}
      metaData={metaData}
      subjects={subjects}
      role={role}
    />
  );
}
