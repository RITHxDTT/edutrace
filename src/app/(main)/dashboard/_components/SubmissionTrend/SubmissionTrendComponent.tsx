'use client'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsAxisData, LineItemIdentifier } from '@mui/x-charts/models';
export default function SubmissionTrendComponent(
  { role }: { role: 'student' | 'teacher' }
) {

  const xAxisData = {
    teacher: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    student: ['HW1', 'Prac1', 'HW2', 'Assign1', 'Prac2', 'HW3', 'Assign2'],
  };

  const lineChartsParams = {
    series: [
      {
        id: 'series-1',
        data: [20, 36, 26, 30, 35, 56, 30],
        label: 'On time',
        area: true,
        stack: 'total',
        highlightScope: {
          highlight: 'item',
        },
        color: '#E9B8FF',
      },
      {
        id: 'series-2',
        data: [64, 26, 26, 32, 35, 18, 60],
        label: 'Late Submission',
        area: true,
        stack: 'total',
        highlightScope: {
          highlight: 'item',
        },
        color: '#8F7CFF',
      },
    ],

    xAxis: [
      {
        data: xAxisData[role] || [],
        scaleType: 'point',
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
  } as const;

  const [itemData, setItemData] = React.useState<LineItemIdentifier>();
  const [axisData, setAxisData] = React.useState<ChartsAxisData | null>();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


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
          onAreaClick={(event, d) => setItemData(d)}
          onMarkClick={(event, d) => setItemData(d)}
          onLineClick={(event, d) => setItemData(d)}
          onAxisClick={(event, d) => setAxisData(d)}
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
          >
          </IconButton>
        </Box>
      </Stack>
    </Stack>
  );
}