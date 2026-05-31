import NavbarTitle from "@/components/Topbar/NavbarTitle";
import FilterTask from "./_components/FilterTask";
import { getAllAssessmentAction } from "@/actions/assessment.action";

export default async function page() {
  const assessments = await getAllAssessmentAction();
  if (!assessments.data) {
    return (
      <div className="p-5">
        <NavbarTitle title="Assessment" override />

        {/* TITLE */}
        <div className="">
          <p>Assessment</p>
          <p>Manage assessments, deadlines, and progress</p>
        </div>

        {/* FILTER */}
        <FilterTask />

        <div>
          Assessment Not Found
        </div>
      </div>
    );
  }
  return (
    <div className="p-5">
      <NavbarTitle title="Assessment" override />

      {/* TITLE */}
      <div className="">
        <p>Assessment</p>
        <p>Manage assessments, deadlines, and progress</p>
      </div>

      {/* FILTER */}
      <FilterTask />
    </div>
  );
}
