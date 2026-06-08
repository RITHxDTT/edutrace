'use client';
import { Message, TickSquare } from 'iconsax-react';
import React from 'react'

export default function ActivityLogComponent({ logs }: { logs: any[] }) {
    return (
        <div className="lg:col-span-3 space-y-6 ">
            <div className="bg-white text-black rounded-2xl p-5 shadow-sm">
                <p className="text-2xl font-medium mb-8  text-linear-main">Activity Log</p>
                <div className=" flex flex-col md:gap-1 lg:gap-8 relative border-l-2 border-gray-100 ml-3 pl-6 ">

                    {(!logs || logs.length === 0) ? (
                        <p className="text-slate-400 text-sm italic">No recent activities found.</p>
                    ) : (
                        logs.map((log: any) => (
                            <div key={log.activityId} className="relative">
                                <span
                                    className={`absolute -left-[35px] top-1 rounded-full  w-6 h-6 flex items-center justify-center ring-4 ring-white
                                            ${log.type.includes('JOIN') ? 'bg-green-500' : 'bg-[#002045]'}
                                            `}
                                >
                                    {log.type.includes('JOIN') ? (
                                        <TickSquare size={12} color="white" />
                                    ) : (
                                        <Message size={12} color="white" />
                                    )}
                                </span>
                                <div >
                                    <p className={`text-medium text-ai ${log.type.includes('JOIN') ? 'font-semibold' : 'font-medium'}`}>
                                        {log.message}
                                    </p>
                                    <p className="text-disabled">{new Date(log.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

