import { PrimaryButton } from '@/components/Buttons/PrimaryButton'
import { Video } from 'iconsax-react'
import React from 'react'

export default function ReminderComponent() {
    return (
        <div>
            <p className="text-2xl font-medium tracking-wider text-color-gray mb-1">Reminder</p>
            <div className="flex flex-col gap-2">
                <h3 className="text-indigo-900 font-bold text-[15px] leading-tight mb-1">
                    Spring Boot Homework 003 Right Now?
                </h3>
                <p className="text-xs text-[#C6C7D0] font-medium">
                    This meeting has <span className="text-indigo-600 ">24</span> students.
                </p>
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-[#4446e5] text-white py-3 px-4 rounded-xl font-medium transition-all hover:bg-opacity-90">
                <Video size={20} color='white' />
                <span> Start Meeting</span>
            </button>
            {/* <PrimaryButton /> */}
        </div>


    )
}