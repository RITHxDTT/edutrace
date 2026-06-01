// page.tsx (server component — thin wrapper)
import { getAllAssessmentAction } from "@/actions/assessment.action";
import { auth } from "@/auth";
import AssessmentPage from "./_components/AssessmentPage";

export default async function Page() {
  const session = await auth();
  const role = session?.user?.role;
  const assessments = await getAllAssessmentAction();

  return <AssessmentPage assessments={assessments} role={role} />;
}