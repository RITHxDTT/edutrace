import { getAllAssessmentAction } from "@/actions/assessment.action";
import { auth } from "@/auth";
import AssessmentPage from "./_components/AssessmentPage";
import { getAllSubjectAction } from "@/actions/subject.action";

export default async function Page() {
  const session = await auth();
  const role = session?.user?.role;
  const assessments = await getAllAssessmentAction();
  const subjects = await getAllSubjectAction();

  return (
    <AssessmentPage assessments={assessments} subjects={subjects} role={role} />
  );
}
