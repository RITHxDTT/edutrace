'use client';

import React from 'react';
import styles from '../../kpicard.module.css';
import { ClipboardText } from 'iconsax-react';

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
                className={`${styles.inverted}  text-linear-main rounded-2xl p-4 md:p-5 flex-1 w-full flex flex-col justify-between`}
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
                <ClipboardText size={20} color='black' />

            </div>
        </div>
    );
}

export default KpiCardComponent;