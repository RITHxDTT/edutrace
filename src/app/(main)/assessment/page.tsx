import NavbarTitle from "@/components/Topbar/NavbarTitle";
import FilterTask from "./_components/FilterTask";
import { getAllAssessmentAction } from "@/actions/assessment.action";
import AssessmentList from "./_components/AssessmentList";
import { auth } from "@/auth";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";

export default async function page() {
  const session = await auth();

  console.log(session?.access_token)

  const role = session?.user?.role;

  const assessments = await getAllAssessmentAction();

  return (
    <div className="flex flex-col gap-5 p-5">
      <NavbarTitle title="Assessment" override />


      {/* TITLE */}
      <div className="w-full flex items-center justify-between">
        <div>
          <p className="text-[24px] font-semibold">Assessment</p>
          <p>Manage assessments, deadlines, and progress</p>
        </div>

        {/* CHECK ROLE */}
        {role === "teacher" && <div><PrimaryButton size={"md"}>Create Assessment</PrimaryButton></div>}

      </div>

      {/* FILTER */}
      <FilterTask />


      {/* ASSESSMENT ALL */}
      <AssessmentList assessments={assessments.data} />
    </div>
  );
}
