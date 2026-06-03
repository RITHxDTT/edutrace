'use client';
import { BarChart } from '@mui/x-charts'
import React from 'react'
import { WeeklyVsRequiredProgress as WeeklyProgressType } from '@/types/dashboard';

export default function WeeklyVsRequiredProgress({ data }: { data?: WeeklyProgressType }) {
    const xAxisData = React.useMemo(() => data?.data.map(d => d.week) || [], [data]);
    const series = React.useMemo(() => {
        if (!data || !data.data || data.data.length === 0) return [];
        return data.legend.map((l, index) => ({
            data: data.data.map(d => (d as any)[l.key] || 0),
            color: index === 0 ? '#241CAB' : '#5D53F9',
            label: l.label
        }));
    }, [data]);

    return (
        <div className=" bg-white text-black rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 ">
                <div>
                    <p className="text-2xl font-medium text-linear-main">{data?.title || 'Weekly vs Required Progress'}</p>
                </div>

                <div className="flex items-center gap-8 text-xs font-medium text-gray-600">
                    {data?.legend.map((l, index) => (
                        <div key={l.key} className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-[#241CAB]' : 'bg-[#5D53F9]'} block`} /> {l.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full">
                {(!data || !data.data || data.data.length === 0) ? (
                    <div className="flex flex-col items-center justify-center w-full h-[200px] bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm font-medium">No progress data available yet</p>
                    </div>
                ) : (
                    <BarChart className="text-medium font-medium "
                        xAxis={[{
                            data: xAxisData,
                            categoryGapRatio: 0.7,
                            barGapRatio: 0.5,
                            scaleType: 'band'
                        }]}


                        yAxis={[
                            {
                                min: 0,
                                tickNumber: 5,
                                valueFormatter: (value: number) => `${value}hr`,
                            },
                        ]}
                        series={series}
                        height={300}
                    />
                )}
            </div>
        </div>
    )
}
