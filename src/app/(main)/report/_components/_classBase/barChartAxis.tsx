"use client";

import { BarChart } from "@mui/x-charts/BarChart";

type ScoreItem = {
  className: string;
  classroomAbbre: string;
  averageScore: number;
  secondAverageScore: number;
};

type HorizontalBarsProps = {
  data: ScoreItem[];
};

const valueFormatter = (value: number | null) =>
  value === null ? "" : `${value}%`;

export default function HorizontalBars({ data }: HorizontalBarsProps) {
  return (
    <div className="w-full rounded-xl bg-white p-2">
      <BarChart
        dataset={data}
        layout="horizontal"
        height={300}
        borderRadius={8}
        margin={{
          top: 10,
          right: 8,
          bottom: 25,
          left: 5,
        }}
        xAxis={[
          {
            min: 0,
            max: 100,
            tickNumber: 5,
            valueFormatter: (value: number) => `${value}`,
          },
        ]}
        yAxis={[
          {
            scaleType: "band",
            dataKey: "classroomAbbre",
            categoryGapRatio: 0.45,
            barGapRatio: 0.25,
          },
        ]}
        series={[
          {
            dataKey: "averageScore",
            valueFormatter,
            color: "#241cab",
          },
          {
            dataKey: "secondAverageScore",
            valueFormatter,
            color: "#5d53f9",
          },
        ]}
        sx={{
          "& .MuiChartsAxis-left .MuiChartsAxis-line": {
            display: "none",
          },
          "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
            display: "none",
          },
          "& .MuiChartsAxis-tick": {
            display: "none",
          },
          "& .MuiChartsAxis-tickLabel": {
            fontSize: "10px",
            fill: "#475569",
          },
          "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
            transform: "translateY(-12px)",
            fontSize: "10px",
            fontWeight: 500,
            fill: "#334155",
          },
          "& .MuiChartsGrid-line": {
            stroke: "#E9ECF5",
            strokeDasharray: "4 4",
          },
          "& .MuiBarElement-root": {
            height: "8px !important",
          },
        }}
        grid={{
          vertical: true,
          horizontal: false,
        }}
      />
    </div>
  );
}
