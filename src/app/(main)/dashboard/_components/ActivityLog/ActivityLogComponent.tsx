import { TickIcon } from '@/app/(landing)/_components/Tick';
import { Message, TickCircle, TickSquare } from 'iconsax-react';
import React from 'react'

export default function ActivityLogComponent() {

    const activityLogs: ActivityLogItem[] = [
        { id: 1, message: 'You have joined Web Development room', timestamp: '11th May 2026, 2:00 PM', type: 'join' },
        { id: 2, message: 'You have left Web Development room', timestamp: '11th May 2026, 5:00 PM', type: 'leave' },
        { id: 3, message: 'You have joined Java Mini-Project 002', timestamp: '11th May 2026, 2:00 PM', type: 'join' },
        { id: 4, message: 'You have left Java Mini-Project 002', timestamp: '11th May 2026, 5:00 PM', type: 'leave' },
        { id: 5, message: 'You have left Web Development room', timestamp: '11th May 2026, 5:00 PM', type: 'leave' },
    ];

    return (
        <div className="lg:col-span-3 space-y-6 ">
            <div className="bg-white text-black rounded-2xl p-5 shadow-sm">
                <p className="text-2xl font-medium mb-8 text-gray-800">Activity Log</p>
                <div className=" flex flex-col md:gap-1 lg:gap-8  relative border-l-2 border-gray-100 ml-3 pl-6 ">

                    {activityLogs.map((log: ActivityLogItem) => (
                        <div key={log.id} className="relative">
                            <span
                                className={`absolute -left-[35px] top-1 rounded-full w-6 h-6 flex items-center justify-center ring-4 ring-white
                                        ${log.type === 'join' ? 'bg-green-500' : 'bg-[#002045]'}
                                        `}
                            >
                                {log.type === 'join' ? (
                                    <TickSquare size={12} color="white" />
                                ) : (
                                    <Message size={12} color="white" />
                                )}
                            </span>
                            <div className='bg-blue-200'>
                                <p className={`text-medium text-gray-800 ${log.type === 'join' ? 'font-semibold' : 'font-medium'}`}>
                                    {log.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{log.timestamp}</p>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    )
}
