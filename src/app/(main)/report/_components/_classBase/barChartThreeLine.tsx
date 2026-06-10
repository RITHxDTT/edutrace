"use client";

import { BarChart } from "@mui/x-charts/BarChart";

export type BreakdownItem = {
  late: number;
  onTime: number;
  missing: number;
  className: string;
  classroomAbbre: string;
};

type BasicBarsProps = {
  data: BreakdownItem[];
};

export default function BasicBars({ data }: BasicBarsProps) {
  const labels = data.map((d) => d.classroomAbbre);

  return (
    <BarChart
      colors={["#241CAB", "#5D53F9", "#93AAFD"]}
      xAxis={[
        {
          data: labels,
          categoryGapRatio: 0.2,
          scaleType: "band",
        },
      ]}
      series={[
        {
          data: data.map((d) => d.onTime),
          label: "On Time",
        },
        {
          data: data.map((d) => d.late),
          label: "Late",
        },
        {
          data: data.map((d) => d.missing),
          label: "Missing",
        },
      ]}
      height={300}
      borderRadius={16}
    />
  );
}