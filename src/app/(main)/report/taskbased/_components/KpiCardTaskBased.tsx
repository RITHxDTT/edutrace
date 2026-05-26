import "@/app/(main)/report/styleReport.css";
import Image from "next/image";

type Props = {
  totalStudents: number;
  className?: string;
  updatedAt?: string;
};

export default function KpiCardTaskBased({
  totalStudents,
  className = "14th Gen",
  updatedAt = "May 08 2026",
}: Props) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", position: "absolute" }}
        width="0"
        height="0"
      >
        <defs>
          <clipPath id="clip-big" clipPathUnits="objectBoundingBox">
            <path d="M0.0546,0H0.6995A0.0273,0.0225,0,0,1,0.7268,0.0225V0.1351A0.0273,0.0225,0,0,0,0.7541,0.1577H0.9727A0.0273,0.0225,0,0,1,1,0.1802V0.955A0.0546,0.045,0,0,1,0.9454,1H0.0546A0.0546,0.045,0,0,1,0,0.955V0.045A0.0546,0.045,0,0,1,0.0546,0Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="inverted-big p-5">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-4xl">
              Total <br /> Students
            </h3>
          </div>
          <div className="relative">
            <Image
              src="/images/kpi/Mask_group.png"
              alt="Total Students"
              width={300}
              height={300}
            />
            <p className="absolute text-7xl text-center -mt-18 ml-26">{totalStudents}</p>
          </div>
          <div>
            <p className="text-2xl text-gray-600 text-center">
              Total students of {className}
            </p>
            <p className="text-gray-500 text-center">
              Updated {updatedAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
