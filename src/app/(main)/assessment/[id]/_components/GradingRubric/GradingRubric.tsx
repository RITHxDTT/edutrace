import { AssessmentType } from "@/types/assessment";
import { Note } from "iconsax-react";
import AssessmentSectionCard from "../AssessmentSectionCard";

type Props = {
    assessment: AssessmentType;
};

type RubricItem = {
    label: string;
    score: number;
};

function parseRubric(gradingRubric?: string | string[], fallbackMaxScore = 0): RubricItem[] {
    if (Array.isArray(gradingRubric)) {
        return gradingRubric.flatMap((item) => parseRubric(item));
    }

    if (!gradingRubric) {
        return fallbackMaxScore > 0 ? [{ label: "Total", score: fallbackMaxScore }] : [];
    }

    const items = gradingRubric
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
            const [label, score] = part.split(":");
            return {
                label: label?.trim() || "Criteria",
                score: Number(score?.trim()),
            };
        })
        .filter((item) => item.label && !Number.isNaN(item.score));

    if (items.length > 0) return items;

    return fallbackMaxScore > 0 ? [{ label: gradingRubric, score: fallbackMaxScore }] : [];
}

export default function GradingRubric({ assessment }: Props) {
    const rubricItems = parseRubric(assessment.gradingRubric, assessment.maxScore ?? 0);
    const totalPoints =
        rubricItems.length > 0
            ? rubricItems.reduce((total, item) => total + item.score, 0)
            : assessment.maxScore ?? 0;
    const passingScore = Math.ceil(totalPoints * 0.6);

    return (
        <AssessmentSectionCard
            title="Grading Rubric"
            icon={Note}
            headerAction={
                <div className="shrink-0 text-right">
                    <p className="text-[11px] font-medium text-tertiary">
                        {rubricItems.length} criteria
                    </p>
                    <p className="text-sm font-semibold text-primary">{totalPoints} pts</p>
                </div>
            }
        >
            <div className="h-[180px] overflow-y-auto rounded-[15px] rounded-t-none border-1 border-t-0 border-[lab(90.952% -.0000596046 0)] bg-white p-[30px]">
                <div className="grid grid-cols-4 gap-2 px-1">
                    {rubricItems.length > 0 ? (
                        rubricItems.map((item) => (
                            <span
                                key={`${item.label}-${item.score}`}
                                className="inline-flex min-w-0 items-center justify-between gap-2 rounded-[6px] bg-input-field px-3 py-1 text-sm font-medium"
                            >
                                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                <span className="shrink-0 rounded bg-light-lavendar px-1 font-medium text-menta">
                                    {item.score} pts
                                </span>
                            </span>
                        ))
                    ) : (
                        <p className="col-span-4 text-sm text-tertiary">No grading rubric provided.</p>
                    )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 px-1">
                    <div className="rounded-[6px] border border-[lab(90.952% -.0000596046 0)] px-3 py-2">
                        <p className="text-xs text-tertiary">Total Points</p>
                        <p className="text-sm font-semibold text-primary">{totalPoints} pts</p>
                    </div>
                    <div className="rounded-[6px] border border-[lab(90.952% -.0000596046 0)] px-3 py-2">
                        <p className="text-xs text-tertiary">Passing Score</p>
                        <p className="text-sm font-semibold text-primary">{passingScore} pts</p>
                    </div>
                </div>
            </div>
        </AssessmentSectionCard>
    );
}
