'use client';
import React from 'react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { recentTasks } from "../../mockupData";
export default function RecentTaskComponent() {
    return (
        <div className="bg-white text-black rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] max-w-4xl mx-auto w-full border border-gray-100/50">
            <div className="mb-5">
                <h2 className="text-2xl font-medium mb-4 text-linear-main  text-gray-800 tracking-tight">Recent Task</h2>
            </div>

            <Table
                isStriped
                removeWrapper
                aria-label="Recent tasks table"
                className="min-w-full table-fixed"
            >
                <TableHeader>
                    <TableColumn className="bg-slate-50/40 text-linear-main font-medium text-sm h-12 pl-4 first:rounded-l-xl">
                        Task Name
                    </TableColumn>
                    <TableColumn className="bg-slate-50/40  text-linear-main font-medium text-sm h-12 ">
                        Deadline
                    </TableColumn>
                    <TableColumn className="bg-slate-50/40  text-linear-main font-medium text-sm h-12">
                        Submission
                    </TableColumn>
                    <TableColumn className="bg-slate-50/40  text-linear-main font-medium text-sm h-12 text-center w-[20%] last:rounded-r-xl">
                        Status
                    </TableColumn>
                </TableHeader>
                <TableBody>
                    {recentTasks.map((task) => (
                        <TableRow key={task.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30 transition-colors">
                            <TableCell className="text-slate-700 py-3.5 pl-4 text-sm truncate">
                                {task.name}
                            </TableCell>
                            <TableCell className="text-slate-500 py-3.5 text-sm">
                                {task.deadline}
                            </TableCell>
                            <TableCell className="text-slate-600 py-3.5 text-sm font-normal">
                                {task.submission}
                            </TableCell>
                            <TableCell className="py-3.5 text-center">
                                {task.status === "Overdue" ? (
                                    <span className="bg-[#FFF4E5] text-[#D97706] px-4 py-1.5 rounded-full text-xs font-medium inline-block min-w-[76px]">
                                        Overdue
                                    </span>
                                ) : (
                                    <span className="bg-[#EBF7EE] text-[#16A34A] px-4 py-1.5 rounded-full text-xs font-medium  min-w-[76px]">
                                        Finish
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
