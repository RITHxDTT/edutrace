"use client";

import { ClipboardList } from "lucide-react";

interface KpiCardProps {
  title: string;
  value?: number | string;
  subtitle?: string;
}

export default function KpiCard({
  title,
  value = 0,
  subtitle = "from all reports",
}: KpiCardProps) {
  const numValue =
    typeof value === "number" ? String(value).padStart(2, "0") : value;

  return (
    <section className="w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", position: "absolute" }}
        width="0"
        height="0"
      >
        <defs>
          <clipPath id="clipPath" clipPathUnits="objectBoundingBox">
            <path d="M0.075,0H0.775A0.075,0.15,0,0,1,0.85,0.15V0.15A0.075,0.15,0,0,0,0.925,0.3H0.925A0.075,0.15,0,0,1,1,0.45V0.85A0.075,0.15,0,0,1,0.925,1H0.075A0.075,0.15,0,0,1,0,0.85V0.15A0.075,0.15,0,0,1,0.075,0Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative w-full">
        <div
          className="w-full shadow-sm"
          style={{
            aspectRatio: "7/4",
            clipPath: "url('#clipPath')",
            background: "white",
          }}
        >
          <div className="flex flex-col justify-between h-full p-4 md:p-5">
            <div>
              <p className="text-sm text-gray-400">{title}</p>

              <h2 className="mt-6 md:mt-10 text-3xl md:text-4xl font-semibold">
                {numValue}
              </h2>
            </div>

            <p className="text-xs md:text-sm text-indigo-500">{subtitle}</p>
          </div>
        </div>

        <div
          className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
          style={{ backgroundColor: "white" }}
        >
          <ClipboardList className="h-5 w-5 text-black" />
        </div>
      </div>
    </section>
  );
}
