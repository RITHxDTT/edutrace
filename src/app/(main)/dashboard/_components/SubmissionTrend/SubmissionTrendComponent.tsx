'use client'

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsAxisData, LineItemIdentifier } from '@mui/x-charts/models';
import { SubmissionTrend, ScoreTrend } from '@/types/dashboard';
import { useTrendData } from './useTrendData';
import {useState} from "react";

export default function SubmissionTrendComponent(
  { role, data }: { role: 'student' | 'teacher', data?: SubmissionTrend | ScoreTrend }
) {
  const { xAxisData, series } = useTrendData(role, data);

  const [itemData, setItemData] = useState<LineItemIdentifier>();
  const [axisData, setAxisData] = useState<ChartsAxisData | null>();

  const lineChartsParams = {
    series: series,
    xAxis: [
      {
        data: xAxisData,
        scaleType: 'point' as const,
        id: 'axis1',
      },
    ],
    yAxis: [
      {
        min: 0,
        max: 100,
        tickNumber: 6,
      },
    ],
    height: 200,
  };

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-50 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <p className="text-slate-400 text-sm font-medium">No trend data available yet</p>
      </div>
    );
  }
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{
        width: 'full',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <LineChart
          {...lineChartsParams}
          onAreaClick={(_event, d) => setItemData(d)}
          onMarkClick={(_event, d) => setItemData(d)}
          onLineClick={(_event, d) => setItemData(d)}
          onAxisClick={(_event, d) => setAxisData(d)}
        />
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '0%' } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              setItemData(undefined);
              setAxisData(null);
            }}
            aria-label="reset"
          />
        </Box>
      </Stack>
    </Stack>
  );
}
