"use client";

import { UsersRound } from "lucide-react";
import Image from "next/image";
import TaskBase from "../../../../../../public/images/card/TaskBase";

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
      {/* mobile view */}
      <div className="block md:hidden relative w-full h-full">
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

        <div
          className="w-full shadow-sm"
          style={{
            aspectRatio: "8 / 4",
            clipPath: "url('#clipPathTaskBased')",
            backgroundColor: "white",
          }}
        >
          <div className="flex h-full flex-col justify-between p-7">
            <p className="text-md leading-5 text-[#8A8A8A]">Total Students</p>

            <div className="relative text-center">
              <div className="flex items-center justify-center mt-4 z-50">
                <Image
                  src="/images/kpi/Mask_group.png"
                  alt="KPI"
                  width={260}
                  height={260}
                  className="
                    w-[340px]
                    sm:w-[370px]
                    h-auto
                  "
                />
              </div>

              <h2 className="absolute inset-0 flex items-center justify-center text-7xl font-semibold mt-[100px]">
                {formattedTotalStudents}
              </h2>
            </div>

            <div className="text-center">
              <p className="text-xl font-medium text-slate-700">
                Total students of {className}
              </p>

              <p className="mt-1 text-lg text-slate-400">Updated {updatedAt}</p>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 flex h-15 w-15 items-center justify-center rounded-xl bg-white">
          <UsersRound className="h-5 w-5" />
        </div>
      </div>

      {/* desktop version */}
      <div className="hidden md:block relative">
        <div
          className="relative w-full p-[10px]"
          style={{
            aspectRatio: "402 / 460",
          }}
        >
          <TaskBase
            className="
              absolute
              inset-0
              w-full
              h-full
            "
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-between p-10">
            <p className="text-md leading-5 text-[#8A8A8A]">Total Students</p>

            <div className="relative flex flex-1 items-center justify-center">
              <Image
                src="/images/kpi/Mask_group.png"
                alt="KPI"
                width={220}
                height={220}
                className="w-[220px] lg:w-[260px] h-auto"
              />

              <h2
                className="absolute text-6xl font-semibold text-black mt-[70px]"
              >
                {formattedTotalStudents}
              </h2>
            </div>

            <div className="text-center">
              <p className="text-xl font-medium text-slate-700">
                Total students of {className}
              </p>

              <p className="mt-1 text-lg text-slate-400">Updated {updatedAt}</p>
            </div>
          </div>

          <div className="absolute right-[30] top-[10]  z-20 flex h-13 w-13  items-center justify-center bg-white rounded-2xl">
            <UsersRound className="h-5 w-5 " />
          </div>
        </div>
      </div>
    </section>
  );
}
