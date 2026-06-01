'use client';
import { PrimaryButton } from '@/components/Buttons/PrimaryButton'
import { Video } from 'iconsax-react'
import React from 'react'
import { Reminder } from '@/types/dashboard';

export default function ReminderComponent({ reminder }: { reminder?: Reminder }) {
    if (!reminder) return null;
    return (
        <div>
            <p className="text-2xl font-medium tracking-wider text-linear-main mb-1">Reminder</p>
            <div className="flex flex-col gap-2">
                <h3 className="text-linear-main font-bold text-[15px] leading-tight mb-1">
                    {reminder.title}
                </h3>
                <p className="text-xs text-[#C6C7D0] font-medium">
                    {reminder.description}
                </p>
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-linear-purple   text-white py-3 px-4 rounded-xl font-medium transition-all hover:bg-opacity-90">
                <Video size={20} color='white' />
                <span> {reminder.actionLabel}</span>
            </button>
            {/* <PrimaryButton /> */}
        </div>


    )
}