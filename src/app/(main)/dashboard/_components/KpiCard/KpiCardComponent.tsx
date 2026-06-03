'use client';

import React from 'react';
import { ClipboardText } from 'iconsax-react';

type Task = {
    title: string;
    value: string | number;
    subtitle?: string;
    subValue?: string;
};

function KpiCardComponent({
    title,
    value,
    subtitle = '',
    subValue = '',
}: Task) {
    return (
        <>
            {/* SVG Clip Path */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block', position: 'absolute' }}
                width="0"
                height="0"
            >
                <defs>
                    <clipPath id="clipPath" clipPathUnits="objectBoundingBox">
                        <path d="M0.075,0H0.775A0.075,0.15,0,0,1,0.85,0.15V0.15A0.075,0.15,0,0,0,0.925,0.3H0.925A0.075,0.15,0,0,1,1,0.45V0.85A0.075,0.15,0,0,1,0.925,1H0.075A0.075,0.15,0,0,1,0,0.85V0.15A0.075,0.15,0,0,1,0.075,0Z" />
                    </clipPath>
                </defs>
            </svg>

            <div className="relative h-fit">
                {/* Card */}
                <div
                    className="w-full overflow-hidden shadow-sm"
                    style={{
                        aspectRatio: '10 / 7',
                        clipPath: "url('#clipPath')",
                        backgroundColor: 'white',

                    }}
                >
                    <div className="flex h-full w-full flex-col gap-6 p-5 justify-between">
                        {/* Content */}
                        <div className='flex flex-col gap-5'>
                            <p className="text-medium font-medium leading-5 text-ai ">
                                {title}
                            </p>

                            <p className=" text-5xl leading-9 font-medium text-linear-main ">
                                {value}
                            </p>
                        </div>

                        {/* Footer */}
                        {(subtitle || subValue) && (
                            <div className="flex items-center gap-2 flex-wrap">
                                    <div className="rounded-sm border border-green-600 px-2 py-1 text-sm text-green-600">
                                        {subValue || "null" }
                                    </div>
                                {subtitle && (
                                    <p className="text-sm text-ai truncate">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Icon Box */}
                <div
                    className="absolute top-0 right-0 flex h-8 w-8 text-linear-main items-center justify-center rounded-xl"
                    style={{
                        backgroundColor: 'white',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',

                    }}
                >
                    <ClipboardText size={18} color='black' />
                </div>
            </div>
        </>
    );
}

export default KpiCardComponent;