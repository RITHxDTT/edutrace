'use client'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsAxisData, LineItemIdentifier } from '@mui/x-charts/models';
import { ClipboardText, ClipboardTick } from 'iconsax-react';

// export default function SubmissionTrendComponent({ data }) { 
// // console.log(data.data)
// console.log("data in ", data.data[0].onTime);

// - Score Trend over Tasks: for student 
// - Score Trend over Tasks: for teacher
export default function SubmissionTrendComponent() {


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

    // For studnet 
    xAxis: [
      {
        data: ['HW1', 'Prac1', 'HW2', 'Assign1', 'Prac2', 'HW3', 'Assign2'],
        scaleType: 'point',
        id: 'axis1',
      },


    ],
    // for instructor

    //   xAxis: [
    //   {
    //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //     scaleType: 'point',
    //     id: 'axis1',
    //   },
    // ],



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