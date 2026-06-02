"use client";

import { BarChart } from "@mui/x-charts/BarChart";

type BreakdownItem = {
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
  const onTimeSeries = data.map((d) => d.onTime);
  const lateSeries = data.map((d) => d.late);
  const missingSeries = data.map((d) => d.missing);

  return (
    <BarChart
      colors={["#241CAB", "#5D53F9", "#93AAFD"]}
      xAxis={[{ data: labels, categoryGapRatio: 0.2 }]}
      series={[
        { data: onTimeSeries },
        { data: lateSeries },
        { data: missingSeries },
      ]}
      height={300}
      borderRadius={16}
    />
  );
}
