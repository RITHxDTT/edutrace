import { BarChart } from '@mui/x-charts'
import React from 'react'

export default function WeeklyVsRequiredProgress() {
    return (
        <div className=" bg-white text-black rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 ">
                <div>
                    <p className="text-2xl font-medium text-gray-800">Weekly vs Required Progress</p>
                </div>

                {/* ====== bar chart====== */}
                <div className="flex items-center gap-8 text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-blue-900 block" /> Logged
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-indigo-300 block" />Required
                    </div>
                </div>
            </div>

            <div className="w-[400px] ">
                <BarChart className="text-xl font-medium "
                    xAxis={[{ data: ['Week 1', 'Week 2', 'Week 3'] }]}
                    yAxis={[
                        {
                            min: 0,
                            max: 4,
                            tickNumber: 5,
                            categoryGapRatio: 0.5,
                            valueFormatter: (value: number) => `${value}hr`,
                        },
                    ]}
                    series={[
                        { data: [33, 8, 70], color: '#1e1b4b' },
                        { data: [85, 5, 52], color: '#c7d2fe' },
                    ]}
                    height={200}
                />
            </div>
        </div>
    )
}
