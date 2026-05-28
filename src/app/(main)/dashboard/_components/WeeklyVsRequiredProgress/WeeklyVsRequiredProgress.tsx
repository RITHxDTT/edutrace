'use client';
import { BarChart } from '@mui/x-charts'
import React from 'react'

export default function WeeklyVsRequiredProgress() {
    return (
        <div className=" bg-white text-black rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 ">
                <div>
                    <p className="text-2xl font-medium text-linear-main">Weekly vs Required Progress</p>
                </div>

                <div className="flex items-center gap-8 text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#241CAB] block" /> Logged
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#5D53F9] block" />Required
                    </div>
                </div>
            </div>

            <div className="w-full">
                <BarChart className="text-medium font-medium "
                    xAxis={[{
                        data: ['Week 1', 'Week 2', 'Week 3'],
                        categoryGapRatio: 0.7,
                        barGapRatio: 0.5,
                    }]}


                    yAxis={[
                        {
                            min: 0,
                            max: 4,
                            tickNumber: 5,
                            categoryGapRatio: 0.6,
                            valueFormatter: (value: number) => `${value}hr`,
                        },
                    ]}
                    series={[
                        { data: [10, 6, 70], color: '#241CAB' },
                        { data: [85, 5, 52], color: '#5D53F9' },
                    ]}
                    height={200}
                />
            </div>
        </div>
    )
}
