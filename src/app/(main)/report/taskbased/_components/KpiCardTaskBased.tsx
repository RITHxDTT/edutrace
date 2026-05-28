"use client";

import { UsersRound } from "lucide-react";
import Image from "next/image";

type Props = {
  totalStudents: number;
  className?: string;
  updatedAt?: string;
};

export default function KpiCardTaskBased({
  totalStudents,
  className,
  updatedAt = "May 08 2026",
}: Props) {
  const formattedTotalStudents = String(totalStudents).padStart(2, "0");

  return (
    <section className="w-full h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", position: "absolute" }}
        width="0"
        height="0"
      >
        <defs>
          <clipPath id="clipPathTaskBased" clipPathUnits="objectBoundingBox">
            <path d="M0.075,0H0.775A0.075,0.15,0,0,1,0.85,0.15V0.15A0.075,0.15,0,0,0,0.925,0.3H0.925A0.075,0.15,0,0,1,1,0.45V0.85A0.075,0.15,0,0,1,0.925,1H0.075A0.075,0.15,0,0,1,0,0.85V0.15A0.075,0.15,0,0,1,0.075,0Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative w-full h-full">
        <div
          className="w-full h-full shadow-sm"
          style={{
            aspectRatio: "7 / 4",
            clipPath: "url('#clipPathTaskBased')",
            backgroundColor: "white",
          }}
        >
          <div className="flex h-full w-full flex-col justify-between p-7">
            {/* header */}
            <p className="text-md leading-5 text-[#8A8A8A]">Total Students</p>
            <div className="text-center relative">
              {/* fixed image chart */}
              <div className="flex items-center justify-center mt-4">
                <Image
                  src="/images/kpi/Mask_group.png"
                  alt="KPI Chart"
                  width={330}
                  height={330}
                />
              </div>

              <div className="flex justify-around items-center inset-0">
                <h2 className="absolute -mt-24 text-6xl font-semibold leading-none text-black">
                  {formattedTotalStudents}
                </h2>
              </div>
            </div>
            {/* footer */}
            <div className="text-center">
              <p className="text-xl font-medium text-slate-700">
                Total students of {className}
              </p>
              <p className="mt-1 text-lg text-slate-400">Updated {updatedAt}</p>
            </div>
          </div>
        </div>

        <div
          className="absolute right-0 top-0 flex h-15 w-15 items-center justify-center rounded-xl shadow-sm"
          style={{ backgroundColor: "white" }}
        >
          <UsersRound className="h-5 w-5 text-black" />
        </div>
      </div>
    </section>
  );
}
