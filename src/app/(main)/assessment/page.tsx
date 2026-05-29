import { auth } from "@/auth";
import NavbarTitle from "@/components/Topbar/NavbarTitle";
import AssessmentPage from "./_components/AssessmentPage";

export default async function Page() {
  const session = await auth();
  const isStudent = session?.user?.role === "student";

  return <AssessmentPage isStudent={isStudent} />;
}