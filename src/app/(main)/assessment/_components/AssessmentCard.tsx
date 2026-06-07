"use client";

import { AssessmentType } from "@/types/assessment";
import { redirect } from "next/navigation";
import styles from "../assessment.module.css";
import Link from "next/link";
import { ArrowRight2, Calendar2 } from "iconsax-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

function BackgroundCard() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 496 407"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_54852_33348)">
        <path
          d="M153.695 49.3262C159.009 58.7685 169.003 64.6113 179.838 64.6113H448C464.569 64.6113 478 78.0428 478 94.6113V358.044C478 374.612 464.569 388.044 448 388.044H48C31.4315 388.044 18 374.612 18 358.044V48C18 31.4315 31.4315 18 48 18H118.522C129.358 18 139.351 23.8428 144.666 33.2851L153.695 49.3262Z"
          fill="white"
        />
      </g>

      <defs>
        <filter
          id="filter0_d_54852_33348"
          x="0"
          y="0"
          width="496"
          height="406.043"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />

          <feMorphology
            radius="3"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_54852_33348"
          />

          <feOffset />

          <feGaussianBlur stdDeviation="7.5" />

          <feComposite
            in2="hardAlpha"
            operator="out"
          />

          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />

          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_54852_33348"
          />

          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_54852_33348"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default function AssessmentCard({
  assessmentId,
  title,
  subject,
  description,
  dueAt,
  startAt,
  status,
}: AssessmentType) {
  const statusLabel = {
    NOT_YET: "Not Yet",
    IN_PROGRESS: "In Progress",
    SCHEDULED: "Scheduled",
    CLOSED: "Closed",
    ARCHIVED: "Archived",
  };
  const audioRef = useRef<HTMLAudioElement | null>(null);


  return (
    <div
      className="relative w-full min-h-95 h-full cursor-pointer"
      onClick={() => redirect(`/assessment/${assessmentId}`)}
    >
      <BackgroundCard />
      <div className="relative z-10 px-2 py-5 flex flex-col h-full min-h-95">
        <div className="flex flex-col flex-1 p-3 sm:p-4 md:p-2">
          {/* Top meta */}
          <div className="flex flex-col flex-1 gap-10 px-5 pb-3.75 pt-[5]">
            <div className="inline-flex items-center">
              <span className="px-2.5 py-2 rounded-[10px] text-xs font-medium bg-light-lavendar text-menta">
                {subject.subjectName}
              </span>
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-base sm:text-lg md:text-[20px] font-semibold text-linear-main">
                {title}
              </h2>
              <span
                className={`${styles.tiptapPreview} text-sm text-primary leading-snug line-clamp-3 sm:line-clamp-1 md:line-clamp-2`}
                dangerouslySetInnerHTML={{ __html: description ?? "" }}
              />
              <div className="mt-auto flex justify-between items-center border-b py-5">
                <span
                  className={`px-2.5 py-2 rounded-[10px] text-xs font-medium ${statusLabel[status] === "Not Yet"
                    ? styles.badgeNotYet
                    : statusLabel[status] === "In Progress"
                      ? styles.badgeInProgress
                      : statusLabel[status] === "Scheduled"
                        ? styles.badgeScheduled
                        : statusLabel[status] === "Closed"
                          ? styles.badgeClosed
                          : "bg-light-gray text-gray"
                    }`}
                >
                  {statusLabel[status]}
                </span>
                <Link
                  href={`/assessment/${assessmentId}`}
                  className="ml-4 flex items-center gap-2 font-medium text-[#0948F7] hover:underline transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details <ArrowRight2 size={16} color="black" />
                </Link>
              </div>

              <div className="flex justify-between items-center text-sm text-border-focus pt-5">
                <span className="flex items-center gap-1">
                  <Calendar2 size={16} color="#6B7280" /> Start:{" "}
                  {startAt ? new Date(startAt).toLocaleDateString("en-GB") : "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar2 size={16} color="#6B7280" /> Due:{" "}
                  {dueAt ? new Date(dueAt).toLocaleDateString("en-GB") : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
