'use client';

import React from 'react';
import styles from '../../kpicard.module.css';

interface Task {
    title: string;
    value: string | number;
    subtitle?: string;
    subValue?: string;
    allowedRoles?: string[];
}

function KpiCardComponent({
    title,
    value,
    subtitle = '',
    subValue = '',
}: Task) {
    return (
        <div className="flex justify-between items-start w-full relative">
            <div
                className={`${styles.inverted} bg-white text-indigo-700 rounded-2xl p-4 md:p-5 flex-1 w-full flex flex-col justify-between`}
            >
                <div>
                    <div>
                        <label className="text-gray-500 text-sm block mb-3">
                            {title}
                        </label>
                    </div>

                    <p className="text-5xl font-medium md:text-5xl font-heading text-linear-purple">
                        {value}
                    </p>
                </div>

                <div className="flex flex-col gap-4 md:gap-6">
                    {(subtitle || subValue) && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            {subValue && (
                                <p className="text-xs text-green-600 border border-green-600 px-2 py-1 rounded font-medium w-max">
                                    {subValue}
                                </p>
                            )}

                            {subtitle && (
                                <p className="text-sm text-gray-600">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute right-3 top-3 flex items-center justify-center bg-white rounded-full shadow-md w-9 h-9 p-1 z-20">
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="clipboardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4c00b0" />
                            <stop offset="100%" stopColor="#7a22ff" />
                        </linearGradient>
                    </defs>
                    <rect x="4" y="6" width="16" height="15" rx="4" stroke="url(#clipboardGradient)"



                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M9 6V4.5C9 3.67157 9.67157 3 10.5 3H13.5C14.3284 3 15 3.67157 15 4.5V6"
                        stroke="url(#clipboardGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M8 11H16"
                        stroke="url(#clipboardGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M8 15H13"
                        stroke="url(#clipboardGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

        </div>
    );
}

export default KpiCardComponent;