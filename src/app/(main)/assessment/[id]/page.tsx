import { getAssessmentByIdAction } from "@/actions/assessment.action";
import { AssessmentType } from "@/types/assessment";
import { BookOpenIcon } from "lucide-react";

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function page({
  params
}: PageProps) {
  const { id } = await params;

  const assessment: AssessmentType = await getAssessmentByIdAction(id);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center">
        <p className="text-[32px] font-medium text-primary">
          {assessment.title}
        </p>
      </div>

      <div>
        <div className="flex gap-2 items-center">
          <BookOpenIcon size={20} color="black" />
          <p>Subject: <span className="font-medium">{assessment.subject.subjectName}</span></p>
        </div>

      </div>

    </div>
  )
}
