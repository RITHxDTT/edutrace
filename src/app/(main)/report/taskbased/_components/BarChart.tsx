"use client";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

type ScoreRange = { range: string; count: number };

type Props = {
  data: ScoreRange[];
};

export default function TickPlacementBars({ data }: Props) {
  const dataset = data.map((d) => ({ range: d.range, count: d.count }));

  return (
    <div style={{ width: "100%" }}>
      <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: "range", scaleType: "band" }]}
        series={[{ dataKey: "count", color: "#6366f1" }]}
        height={300}
        margin={{ left: 0 }}
        borderRadius={16}
      />
    </div>
  );
}
