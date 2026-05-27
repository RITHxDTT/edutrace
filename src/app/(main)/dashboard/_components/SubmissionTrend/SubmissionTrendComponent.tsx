'use client'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsAxisData, LineItemIdentifier } from '@mui/x-charts/models';
import { ClipboardText, ClipboardTick } from 'iconsax-react';
<<<<<<< Updated upstream:src/app/(main)/dashboard/_components/SubmissionTrend/page.tsx
=======
import { lineChartsParams } from "../../mockupData";
>>>>>>> Stashed changes:src/app/(main)/dashboard/_components/SubmissionTrend/SubmissionTrendComponent.tsx

//===>> Line Chart

// export default function SubmissionTrendComponent({ data }) { 
// // console.log(data.data)
// console.log("data in ", data.data[0].onTime);
export default function SubmissionTrendComponent() {

<<<<<<< Updated upstream:src/app/(main)/dashboard/_components/SubmissionTrend/page.tsx
export default function SubmissionTrendComponent() {
=======
>>>>>>> Stashed changes:src/app/(main)/dashboard/_components/SubmissionTrend/SubmissionTrendComponent.tsx
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
<<<<<<< Updated upstream:src/app/(main)/dashboard/_components/SubmissionTrend/page.tsx
            <ClipboardText size={20} color='black'/>
            {/* <UndoOutlinedIcon fontSize="small" /> */}
=======
>>>>>>> Stashed changes:src/app/(main)/dashboard/_components/SubmissionTrend/SubmissionTrendComponent.tsx
          </IconButton>
        </Box>
      </Stack>
    </Stack>
  );
}
