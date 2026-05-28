'use client';

import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Fullscreen } from 'lucide-react';
import { size, submissionTrend } from "../../mockupData";

export const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
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
    return (
        <PieChart
            series={[
                {
                    data: submissionTrend,
                    innerRadius: 80,
                },
            ]}
            {...size}
        >
            <PieCenterLabel>85.25</PieCenterLabel>
        </PieChart>
    );
}