import { ArrowRight } from 'iconsax-react'
import React from 'react'

export default function CurrentTaskComponent() {
    return (

        <div className=''>
            <div className="mb-4">
                <h2 className="text-2xl font-medium text-white">Current Task</h2>
            </div>

            <div className="space-y-3">
                <button className="w-full flex items-center justify-between bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl transition-all">
                    <span className="font-medium text-sm text-color-accent-linear-purple">Spring Boot Homework 003</span>
                    <ArrowRight size={20} color='white' />
                </button>
                <button className="w-full flex items-center justify-between  text-white py-3 px-4 rounded-xl transition-all">
                    <span className="font-medium text-sm">Web Homework 002</span>
                    {/* <div className="w-6 h-6 rounded-full bg-white text-indigo-600  flex items-center justify-center font-bold"></div> */}
                    <ArrowRight size={20} color='white' />
                </button>
            </div>
        </div>
    )
}

//   <ClipboardText size={20} color='black' /> ==> this is sample
