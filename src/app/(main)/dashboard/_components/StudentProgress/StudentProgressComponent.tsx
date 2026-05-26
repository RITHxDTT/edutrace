import React from 'react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import Image from 'next/image';
export default function StudentProgressComponent() {
    return (
        <div className="bg-white text-black rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] max-w-4xl mx-auto w-full border border-gray-100/50">
            <div className="mb-5">
                <h2 className="text-2xl font-medium mb-4 text-gray-800 tracking-tight">Student Progress</h2>
            </div>

            <Table
                isStriped
                removeWrapper
                aria-label="Student progress table"
                className="min-w-full"
            >
                <TableHeader>
                    <TableColumn className="bg-slate-50/40 text-indigo-600 font-semibold text-sm h-12 pl-6 w-[40%] first:rounded-l-xl">
                        Student Name
                    </TableColumn>
                    <TableColumn className="bg-slate-50/40 text-indigo-600 font-semibold text-sm h-12 text-center w-[20%]">
                        Completion
                    </TableColumn>
                    <TableColumn className="bg-slate-50/40 text-indigo-600 font-semibold text-sm h-12 text-center w-[20%]">
                        Late
                    </TableColumn>
                    <TableColumn className="bg-slate-50/40 text-indigo-600 font-semibold text-sm h-12 text-center w-[20%] last:rounded-r-xl">
                        Status
                    </TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30 transition-colors">
                        <TableCell className="py-4 pl-6">
                            <div className="flex items-center gap-3 text-x">
                                <Image
                                    src="/images/profile/YannVannet.jpg"
                                    alt="Dara Nikor"
                                    width={40}
                                    height={40}
                                    className="size-10 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                    <p className="text-slate-700 font-semibold text-sm leading-tight">Yann Vannet</p>
                                    <p className="text-slate-400 text-xs mt-0.5">yannvannet@gmail.com</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-700 font-medium text-sm text-center py-4">100%</TableCell>
                        <TableCell className="text-slate-700 font-medium text-sm text-center py-4">2%</TableCell>
                        <TableCell className="text-center py-4">
                            <span className="bg-[#EBF7EE] text-color-darkgreen px-5 py-1.5 rounded-full text-xs font-bold inline-block min-w-[85px]">
                                Good
                            </span>
                        </TableCell>
                    </TableRow>

                    {/* Row 2 */}
                    <TableRow className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30 transition-colors">
                        <TableCell className="py-4 pl-6">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/images/profile/UyChakriya.jpg"
                                    alt="Dara Nikor"
                                    width={40}
                                    height={40}
                                    className="size-10 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                    <p className="text-slate-700 font-semibold text-sm leading-tight">Uy Chakriya</p>
                                    <p className="text-slate-400 text-xs mt-0.5">uychakriya@gmail.com</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-700 font-medium text-sm text-center py-4">95%</TableCell>
                        <TableCell className="text-slate-700 font-medium text-sm text-center py-4">5%</TableCell>
                        <TableCell className="text-center py-4">
                            <span className="bg-[#EBF7EE] text-[#16A34A] px-5 py-1.5 rounded-full text-xs font-bold inline-block min-w-[85px]">
                                Good
                            </span>
                        </TableCell>
                    </TableRow>

                    <TableRow className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30 transition-colors">
                        <TableCell className="py-4 pl-6">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/images/profile/TryLihai.jpg"
                                    alt="Try Limhai"
                                    width={40}
                                    height={40}
                                    className="size-10 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                    <p className="text-slate-700 font-semibold text-sm leading-tight">Try Limhai</p>
                                    <p className="text-slate-400 text-xs mt-0.5">trilimhai@gmail.com</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-700 font-medium text-sm text-center py-4">45%</TableCell>
                        <TableCell className="text-slate-700 font-medium text-sm text-center py-4">55%</TableCell>
                        <TableCell className="text-center py-4">
                            <span className="bg-[#FCE8E6] text-[#B91C1C] px-5 py-1.5 rounded-full text-xs font-bold inline-block min-w-[85px]">
                                At Risk
                            </span>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
