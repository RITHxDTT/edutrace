"use client";

import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { size, submissionTrend } from "../../mockupData";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "middle",
  fontSize: 24,
  fontWeight: 600,
  fontFamily: "Fredoka, sans-serif",
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return (
    <PieChart
      series={[{ data: submissionTrend, innerRadius: 80 }]}
      sx={{
        "& .MuiChartsLegend-label": {
          fontFamily: "Fredoka, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          fill: "#6B7280",
        },
      }}
      {...size}
    >
      <PieCenterLabel>85.25</PieCenterLabel>
    </PieChart>
  );
}   