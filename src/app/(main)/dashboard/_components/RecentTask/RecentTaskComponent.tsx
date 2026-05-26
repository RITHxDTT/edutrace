import React from 'react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
export default function RecentTaskComponent() {

    const recentTasks: RecentTask[] = [
        { id: "1", name: "Web-Homework-002 (Css Ba...", deadline: "Apr 07, 2026", submission: "60%", status: "Overdue" },
        { id: "2", name: "Java Mini Project 1", deadline: "Apr 07, 2026", submission: "100%", status: "Finish" },
        { id: "3", name: "Web-MiniProject001", deadline: "Apr 07, 2026", submission: "60%", status: "Overdue" },
        { id: "4", name: "Java Mini Project 1", deadline: "Apr 07, 2026", submission: "100%", status: "Finish" },
    ];
    return (
        <div className="bg-white text-black rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] max-w-4xl mx-auto w-full border border-gray-100/50">
            <div className="mb-5">
                <h2 className="text-2xl font-medium mb-4 text-gray-800 tracking-tight">Recent Task</h2>
            </div>

            <Table
                isStriped
                removeWrapper
                aria-label="Recent tasks table"
                className="min-w-full table-fixed"
            >
                <TableHeader>
                    <TableColumn className="bg-slate-50/40 text-indigo-600 font-semibold text-sm h-12 pl-4 first:rounded-l-xl">
                        Task Name
                    </TableColumn>
                    <TableColumn className="bg-slate-50/40 text-indigo-600 font-semibold text-sm h-12 ">
                        Deadline
                    </TableColumn>
                    <TableColumn className="bg-slate-50/40 text-indigo-600 font-semibold text-sm h-12">
                        Submission
                    </TableColumn>
                    <TableColumn className="bg-slate-50/40 text-indigo-600 font-semibold text-sm h-12 text-center w-[20%] last:rounded-r-xl">
                        Status
                    </TableColumn>
                </TableHeader>
                <TableBody>
                    {recentTasks.map((task) => (
                        <TableRow key={task.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30 transition-colors">
                            <TableCell className="text-slate-700 font-medium py-3.5 pl-4 text-sm truncate">
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
                                    <span className="bg-[#FFF4E5] text-[#D97706] px-4 py-1.5 rounded-full text-xs font-semibold inline-block min-w-[76px]">
                                        Overdue
                                    </span>
                                ) : (
                                    <span className="bg-[#EBF7EE] text-[#16A34A] px-4 py-1.5 rounded-full text-xs font-semibold inline-block min-w-[76px]">
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
