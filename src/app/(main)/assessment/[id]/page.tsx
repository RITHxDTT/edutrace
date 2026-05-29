import { auth } from "@/auth";
import AssessmentDetailPage from "./_components/AssessmentDetailPage";

export default async function Page() {
  const session = await auth();
  const isStudent = session?.user?.role === "student";

  return <AssessmentDetailPage isStudent={isStudent} />;
}
