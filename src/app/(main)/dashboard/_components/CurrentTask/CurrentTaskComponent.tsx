'use client';

import { ArrowRight } from 'iconsax-react';
import React from 'react';

export default function CurrentTaskComponent() {
    return (
        <div className="w-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-2xl font-medium text-white">
                    Current Task
                </h2>
            </div>

            <div className="flex flex-col gap-3 w-full">

                <button
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
                        Spring Boot Homework 003
                    </span>

                    <ArrowRight
                        size={20}
                        color="white"
                        className="flex-shrink-0 ml-3"
                    />
                </button>

                <button
                    className="w-full flex items-center justify-between	bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl		
						transition-all min-h-[60px]"
                >
                    <span className=" text-medium text-left break-words">
                        Web Homework 002
                    </span>

                    <ArrowRight
                        size={20}
                        color="white"
                        className="flex-shrink-0 ml-3"
                    />
                </button>
            </div>
        </div>
    );
}