"use client";

import Link from "next/link";
import { Assessment } from "../types";
import AssessmentCard from "./AssessmentCard/AssessmentCard";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";
import { ChevronRight } from "lucide-react";
import DateRow from "./DateRow";

interface Props {
  assessment: Assessment;
}

export default function AssessmentItem({ assessment }: Props) {
  return (
    <Link href={`/assessment/${assessment.id}`}>
      <AssessmentCard className="min-w-[500px] min-h-[328px]">
        <div className="p-5 flex flex-col gap-4 h-full justify-between">
          <CategoryBadge label={assessment.category} />

          <div className="w-full">
            <h3 className="text-xl font-bold text-indigo-700">
              {assessment.title}
            </h3>

            <div
              className="text-sm text-slate-500 mt-2 line-clamp-3 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: assessment.description }}
            />
          </div>

          <div className="flex items-center justify-between mt-auto">
            <StatusBadge status={assessment.status} />

            <button className="flex items-center gap-1 text-blue-700 text-sm font-medium">
              View Details
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="border-t pt-4">
            <DateRow
              startDate={assessment.startDate}
              endDate={assessment.endDate}
            />
          </div>
        </div>
      </AssessmentCard>
    </Link>
  );
}
