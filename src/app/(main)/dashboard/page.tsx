"use client";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import styles from './kpicard.module.css';
import SubmissionTrendComponent from "./_components/SubmissionTrend/SubmissionTrendComponent";
import { BarChart } from '@mui/x-charts/BarChart';
import PieChartWithCenterLabel from "./_components/PieChartWithCenterLabel/PieChartWithCenterLabelComponent";
import KpiCardComponent from "../dashboard/_components/KpiCard/KpiCardComponent";
import Image from "next/image";

export default function Page() {
  const isTeacher = false;
  const isStudent = true;
  interface Task {
    title: string;
    value: string | number;
    subtitle?: string;
    subValue?: string;
    allowedRoles: ('student' | 'instructor')[];
  }

  interface ActivityLogItem {
    id: number;
    message: string;
    timestamp: string;
    type: 'join' | 'leave';
  }

  interface TaskItem {
    id: string;
    name: string;
    deadline: string;
    submission: string;
    status: "Overdue" | "Finish";
  }

  const recentTasks: TaskItem[] = [
    { id: "1", name: "Web-Homework-002 (Css Ba...", deadline: "Apr 07, 2026", submission: "60%", status: "Overdue" },
    { id: "2", name: "Java Mini Project 1", deadline: "Apr 07, 2026", submission: "100%", status: "Finish" },
    { id: "3", name: "Web-MiniProject001", deadline: "Apr 07, 2026", submission: "60%", status: "Overdue" },
    { id: "4", name: "Java Mini Project 1", deadline: "Apr 07, 2026", submission: "100%", status: "Finish" },
  ];

  const tasks: Task[] = [
    { title: "Total tasks", value: "56", subtitle: "Increase from last task.", subValue: "+12%", allowedRoles: ['student'] },
    { title: "Total Submission", value: "10%", subtitle: "Increase from last task.", subValue: "+3%", allowedRoles: ['student', 'instructor'] },
    { title: "Late Submission", value: "56%", subtitle: "Increase from last task.", subValue: "+12%", allowedRoles: ['student', 'instructor'] },
    { title: "At-risk students", value: "20", subtitle: "Increase from last task.", subValue: "+3%", allowedRoles: ['instructor'] }
  ];

  const activityLogs: ActivityLogItem[] = [
    { id: 1, message: 'You have joined Web Development room', timestamp: '11th May 2026, 2:00 PM', type: 'join' },
    { id: 2, message: 'You have left Web Development room', timestamp: '11th May 2026, 5:00 PM', type: 'leave' },
    { id: 3, message: 'You have joined Java Mini-Project 002', timestamp: '11th May 2026, 2:00 PM', type: 'join' },
    { id: 4, message: 'You have left Java Mini-Project 002', timestamp: '11th May 2026, 5:00 PM', type: 'leave' },
    { id: 5, message: 'You have left Web Development room', timestamp: '11th May 2026, 5:00 PM', type: 'leave' },
  ];

  if (isTeacher) {
    return (
      <div>
        {/* ========= Card ========== */}
        <div className="flex flex-col flex-1 w-full text-white p-6 overflow-y-scroll h-screen space-y-5 ">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[28px] font-semibold text-indigo-700">Welcome back, Tan Dara</h1>
            </div>
          </div>

          {/* KPI Cards */}
          <svg
            className={styles.svgAsset}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ position: 'absolute', width: 0, height: 0 }}
          >
            <defs>
              <clipPath id="clip" clipPathUnits="objectBoundingBox">
                <path d="M0.0587,0H0.8534A0.0293,0.0431,0,0,1,0.8827,0.0431V0.1293A0.0293,0.0431,0,0,0,0.912,0.1724H0.9707A0.0293,0.0431,0,0,1,1,0.2155V0.9138A0.0587,0.0862,0,0,1,0.9413,1H0.0587A0.0587,0.0862,0,0,1,0,0.9138V0.0862A0.0587,0.0862,0,0,1,0.0587,0Z" />
              </clipPath>
            </defs>
          </svg>

          <div className="flex gap-6">
            {tasks.map((task, index) => (
              <KpiCardComponent
                key={index}
                title={task.title}
                value={task.value}
                subtitle={task.subtitle}
                subValue={task.subValue}
              />
            ))}
          </div>

          {/* ========= Graph And Table ==========  */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* ==>> Line Chart */}
            <div className="flex flex-col space-y-6 flex-1 w-full">
              <div className="bg-white text-black rounded-2xl p-5 shadow-sm">
                <p className="text-2xl font-medium mb-4 text-gray-800">Submission Trend</p>
                <div className="w-full bg-transparent rounded-xl">
                  <SubmissionTrendComponent />
                </div>
              </div>

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
            </div>

            {/*==>> Recent Task Table Card */}
            <div className="flex flex-col space-y-6 flex-1 w-full">
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

              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="bg-[#2425aa] rounded-2xl shadow-sm p-5 w-full md:w-3/5 flex flex-col justify-between">
                  <div className="mb-4">
                    <h2 className="text-2xl font-medium text-white">Current Task</h2>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl transition-all">
                      <span className="font-medium text-sm text-color-accent-linear-purple">Spring Boot Homework 003</span>
                      <div className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold"></div>
                    </button>
                    <button className="w-full flex items-center justify-between  text-white py-3 px-4 rounded-xl transition-all">
                      <span className="font-medium text-sm">Web Homework 002</span>
                      <div className="w-6 h-6 rounded-full bg-white text-indigo-600  flex items-center justify-center font-bold"></div>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-white text-black rounded-2xl shadow-sm p-5 w-full md:w-2/5 ">
                  <p className="text-2xl font-medium tracking-wider text-color-gray mb-1">Reminder</p>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-indigo-900 font-bold text-[15px] leading-tight mb-1">
                      Spring Boot Homework 003 Right Now?
                    </h3>
                    <p className="text-xs text-[#C6C7D0] font-medium">
                      This meeting has <span className="text-indigo-600 font-bold">24</span> students.
                    </p>
                  </div>

                  <button className="mt-4 w-full flex items-center justify-center gap-2 bg-[#4446e5] text-white py-3 px-4 rounded-xl font-medium transition-all hover:bg-opacity-90">
                    <span></span> Start Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }

  if (isStudent) {
    return (
      <div className="flex flex-col flex-1 w-full text-white p-6 overflow-y-scroll h-screen space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[28px] font-semibold text-indigo-700">Welcome back, Uy Chakriya</h1>
          </div>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-9 space-y-6">

            {/* ========= Card ========== */}
            {/*KPI Cards */}
            <svg
              className={styles.svgAsset}
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ position: 'absolute', width: 0, height: 0 }}
            >
              <defs>
                <clipPath id="clip" clipPathUnits="objectBoundingBox">
                  <path d="M0.0587,0H0.8534A0.0293,0.0431,0,0,1,0.8827,0.0431V0.1293A0.0293,0.0431,0,0,0,0.912,0.1724H0.9707A0.0293,0.0431,0,0,1,1,0.2155V0.9138A0.0587,0.0862,0,0,1,0.9413,1H0.0587A0.0587,0.0862,0,0,1,0,0.9138V0.0862A0.0587,0.0862,0,0,1,0.0587,0Z" />
                </clipPath>
              </defs>
            </svg>

            <div className="flex gap-6">
              {tasks.slice(0, 3).map((task, index) => (
                <KpiCardComponent
                  key={index}
                  title={task.title}
                  value={task.value}
                  subtitle={task.subtitle}
                  subValue={task.subValue}
                />
              ))}
            </div>

            <div className="bg-white text-black rounded-2xl p-5 shadow-sm">
              <p className="text-2xl font-medium mb-4 text-gray-800">Show how student change task by task
              </p>
              <div className="w-full">
                <SubmissionTrendComponent />
              </div>
            </div>

            <div className="bg-white text-black rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>

                  <p className="text-2xl font-medium text-gray-800">Weekly vs Required Progress</p>
                </div>

                {/* ====== bar chart====== */}
                <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-900 block" /> Avg. Score
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-indigo-300 block" /> Avg. Score
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-400 block" /> Submission Breakdown
                  </div>
                </div>
              </div>

              <div className="w-full">
                <BarChart className="text-xl font-medium"
                  xAxis={[{ data: ['PP Class', 'SR Class', 'PVH Class'] }]}
                  series={[
                    { data: [33, 8, 70], color: '#1e1b4b' },
                    { data: [85, 5, 52], color: '#c7d2fe' },
                    { data: [54, 38, 33], color: '#60a5fa' }
                  ]}
                  height={200}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">

            <div className="bg-white text-black rounded-2xl p-5 shadow-sm">
              <p className="text-2xl font-medium mb-4 text-gray-800">Submission Trends</p>
              <div className="w-full flex justify-center items-center py-2">
                <PieChartWithCenterLabel />
              </div>
            </div>

            <div className="bg-white text-black rounded-2xl p-5 shadow-sm">
              <p className="text-2xl font-medium mb-8 text-gray-800">Activity Log</p>
              <div className=" flex flex-col md:gap-1 lg:gap-8  relative border-l-2 border-gray-100 ml-3 pl-6">

                {activityLogs.map((log: ActivityLogItem) => (
                  <div key={log.id} className="relative">

                    <span
                      className={`absolute -left-[31px] top-1 text-white rounded-full p-1 w-4 h-4 flex items-center justify-center text-[8px] ring-4 ring-white ${log.type === 'join' ? 'bg-green-500' : 'bg-slate-900'
                        }`}
                    />
                    <div>
                      <p className={`text-sm text-gray-800 ${log.type === 'join' ? 'font-semibold' : 'font-medium'}`}>
                        {log.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}