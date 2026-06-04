'use client';

import { ArrowRight } from 'iconsax-react';
import React from 'react';
import { DashboardCurrentTask } from '@/types/dashboard';

export default function CurrentTaskComponent({ tasks }: { tasks: DashboardCurrentTask[] }) {
    return (
        <div className="w-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-2xl font-medium text-white">
                    Current Task
                </h2>
            </div>

            <div className="flex flex-col gap-3 w-full">
                {(tasks || []).map((task) => (
                    <button
                        key={task.assessmentId}
                        className="
                            w-full
                            flex items-center justify-between
                            bg-white/20 hover:bg-white/30
                            text-white
                            py-3 px-4
                            rounded-xl
                            transition-all
                            min-h-[60px]
                        "
                    >
                        <span className=" text-medium text-color-accent-linear-purple text-left break-words">
                            {task.taskName}
                        </span>

                        <ArrowRight
                            size={20}
                            color="white"
                            className="flex-shrink-0 ml-3"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}