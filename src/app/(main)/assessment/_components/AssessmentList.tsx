import { ClipboardText } from "iconsax-react";
import { AssessmentProps } from "@/types/assessment";
import AssessmentCard from "./AssessmentCard";

export default function AssessmentList({ assessments }: AssessmentProps) {
    if (assessments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-light-lavendar p-5">
                    <ClipboardText
                        size={48}
                        color="white"
                    />
                </div>

                <h3 className="text-xl font-semibold text-gray-800">
                    No Assessments Yet
                </h3>

                <p className="mt-2 max-w-md text-sm text-gray-500">
                    There are currently no assessments available. Once your teacher
                    creates and assigns assessments, they will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-6">
            {assessments.map((assessment) => (
                <AssessmentCard
                    key={assessment.assessmentId}
                    assessmentId={assessment.assessmentId}
                    title={assessment.title}
                    description={assessment.description}
                    subject={assessment.subject}
                    status={assessment.status}
                    startAt={assessment.startAt}
                    dueAt={assessment.dueAt}
                    assignedBy={assessment.assignedBy}
                />
            ))}
        </div>
    );
}