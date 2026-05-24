"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AssessmentCard from "./AssessmentCard/AssessmentCard";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";
import DateRow from "./DateRow";
import { Assessment } from "../types";

interface Props {
  assessment: Assessment;
}

export default function AssessmentItem({ assessment }: Props) {
  return (
    <Link href={`/assessment/${assessment.id}`}>
      <AssessmentCard className="overflow-hidden flex flex-col hover:shadow-lg transition-all duration-200">
        <div className="p-5 flex flex-col gap-4 h-full">
          <CategoryBadge label={assessment.category} />

          <div>
            <h3 className="text-xl font-bold text-indigo-700">
              {assessment.title}
            </h3>

            <p className="text-sm text-slate-500 mt-2 line-clamp-3">
              {assessment.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <StatusBadge status={assessment.status} />

            <button className="flex items-center gap-1 text-indigo-600 text-sm font-medium">
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
