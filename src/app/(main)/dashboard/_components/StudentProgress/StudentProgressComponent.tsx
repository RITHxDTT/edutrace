'use client';

import React from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from '@heroui/table';

import Image from 'next/image';

export default function StudentProgressComponent({ progress }: { progress: any[] }) {
    return (
        <div className="bg-white text-black rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] max-w-4xl mx-auto w-full border border-gray-100/50">

            <div className="mb-5">
                <h2 className="text-2xl font-medium mb-4 text-linear-main tracking-tight">
                    Student Progress
                </h2>
            </div>

            <Table
                isStriped
                removeWrapper
                aria-label="Student progress table"
                className="min-w-full"
            >
                <TableHeader>
                    <TableColumn className="bg-slate-50/40  text-linear-main text-sm h-12 pl-6 w-[40%] first:rounded-l-xl">
                        Student Name
                    </TableColumn>

                    <TableColumn className="bg-slate-50/40  text-linear-main text-sm h-12 text-center w-[20%]">
                        Completion
                    </TableColumn>

                    <TableColumn className="bg-slate-50/40  text-linear-main text-sm h-12 text-center w-[20%]">
                        Late
                    </TableColumn>

                    <TableColumn className="bg-slate-50/40  text-linear-main text-sm h-12 text-center w-[20%] last:rounded-r-xl">
                        Status
                    </TableColumn>
                </TableHeader>

                <TableBody emptyContent={"No student progress data available."}>
                    {(progress || []).map((student) => (
                        <TableRow
                            key={student.studentId}
                            className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30 transition-colors"
                        >
                            <TableCell className="py-4 pl-6">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={student.profileImage || "/images/profile/fallback.webp"}
                                        alt={student.studentName}
                                        width={40}
                                        height={40}
                                        className="size-10 rounded-full object-cover border border-slate-200"
                                    />

                                    <div>
                                        <p className="text-slate-700 text-sm leading-tight">
                                            {student.studentName}
                                        </p>

                                        <p className="text-slate-400 text-xs mt-0.5">
                                            {student.email}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell className="text-slate-700 text-sm text-center py-4">
                                {student.completionRate}%
                            </TableCell>

                            <TableCell className="text-slate-700 text-sm text-center py-4">
                                {student.lateRate}%
                            </TableCell>

                            <TableCell className="text-center py-4">
                                <span
                                    className={`${student.status === "AT_RISK" ? "bg-[#FBE7E8] text-[#B91C1C]" : "bg-[#EBF9F1] text-[#1F9254]"} px-5 py-1.5 rounded-full text-xs font-bold inline-block min-w-[85px]`}
                                >
                                    {student.status}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}