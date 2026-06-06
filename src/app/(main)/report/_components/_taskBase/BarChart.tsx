"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { ScoreDistributionItem } from "@/types/report";

type Props = {
  data: ScoreDistributionItem[];
};

export default function TickPlacementBars({ data }: Props) {
  if (!data || !Array.isArray(data)) return null;

  const dataset = data.map((d) => ({
    range: d.range,
    count: d.count,
  }));

  return (
    <div className="w-full max-w-[600px]">
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            dataKey: "range",
            scaleType: "band",
            categoryGapRatio: 0.5,
            tickLabelStyle: {
              fontSize: 12,
            },
          },
        ]}
        series={[
          {
            dataKey: "count",
            color: "#6366f1",
          },
        ]}
        
        height={380}
        margin={{ left: 10, right: 10, top: 10, bottom: 30 }}
        borderRadius={16}
      />
    </div>
  );
}