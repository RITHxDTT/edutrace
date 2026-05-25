import "@/app/(main)/report/styleReport.css";
import Image from "next/image";

interface KpiCardProps {
  title: string;
  value?: number | string;
}

export default function KpiCard({ title, value = 0 }: KpiCardProps) {
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
          <clipPath id="clip" clipPathUnits="objectBoundingBox">
            <path d="M0.0581,0H0.6802A0.0291,0.0474,0,0,1,0.7093,0.0474V0.2844A0.0291,0.0474,0,0,0,0.7384,0.3318H0.9709A0.0291,0.0474,0,0,1,1,0.3791V0.9052A0.0581,0.0948,0,0,1,0.9419,1H0.0581A0.0581,0.0948,0,0,1,0,0.9052V0.0948A0.0581,0.0948,0,0,1,0.0581,0Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="inverted p-5 rounded-2xl">
        <div className="flex flex-col justify-between h-full">
          <div className=" ">
            <h2 className="text-lg ">{title}</h2>
            {/* <div className="">
              <Image
                src="/icons/clipboard-tick.svg"
                alt=" "
                width={30}
                height={30}
                className="h-10 w-10 ml-24"
              />
            </div> */}
          </div>
          <h2 className="text-4xl font-semibold">{numValue}</h2>
          <p className="text-sm text-indigo-500">from all reports</p>
        </div>
      </div>
    </section>
  );
}
