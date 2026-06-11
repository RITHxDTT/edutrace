"use client";

import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "middle",
  fontSize: 24,
  fontWeight: 600,
  fontFamily: "Fredoka, sans-serif",
}));

export function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

const size = {
    width: 200,
    height: 200,
};

export default function PieChartWithCenterLabel({ data, centerLabel }: { data?: any[], centerLabel?: string }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = React.useMemo(() => {
    const hasData = (data || []).some(d => d.count > 0);
    if (!hasData) {
      return [{ value: 1, label: 'No Data', color: '#F3F4F6' }];
    }
    return (data || []).map(d => ({
      value: d.count,
      label: d.label,
      color: d.status === 'ON_TIME' ? '#962DFF' : d.status === 'LATE' ? '#C6D2FD' : '#8979FF'
    }));
  }, [data]);

  const displayLabel = React.useMemo(() => {
    const hasData = (data || []).some(d => d.count > 0);
    return hasData ? (centerLabel || "0") : "0";
  }, [data, centerLabel]);

  if (!mounted) return null;

  return (
    <PieChart
      series={[{ data: chartData, innerRadius: 80 }]}
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
      <PieCenterLabel>{displayLabel}</PieCenterLabel>
    </PieChart>
  );
  }