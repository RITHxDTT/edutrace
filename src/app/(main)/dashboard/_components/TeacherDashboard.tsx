
'use client'

import React, { use } from 'react';
import KpiCardComponent from './KpiCard/KpiCardComponent';
import SubmissionTrendComponent from './SubmissionTrend/SubmissionTrendComponent';
import StudentProgressComponent from './StudentProgress/StudentProgressComponent';
import RecentTaskComponent from './RecentTask/RecentTaskComponent';
import CurrentTaskComponent from './CurrentTask/CurrentTaskComponent';
import ReminderComponent from './Reminder/ReminderComponent';
import { DashboardTeacherPayload } from '@/types/dashboard';

interface TeacherDashboardProps {
  dataPromise: Promise<DashboardTeacherPayload>;
  userName: string;
}

export default function TeacherDashboard({ dataPromise, userName }: TeacherDashboardProps) {
  const data = use(dataPromise);
  
  if (!data) return null;

  const { summary, submissionTrend, studentProgress, recentTasks, currentTasks, reminder } = data;

  const kpiData = [
    { title: "Total tasks", value: summary.totalTasks.value, subtitle: "Classes", subValue: summary.totalTasks.totalClasses.toString() },
    { title: "Active Tasks", value: summary.activeTasks.value, subtitle: "Total active" },
    { title: "At-risk students", value: summary.atRiskStudents.value, subtitle: "need attention" },
    { title: "Total Submission", value: `${summary.submissionRate.value}%`, subtitle: summary.submissionRate.comparisonLabel, subValue: `${summary.submissionRate.change}%` },
    { title: "Late Submission rate", value: `${summary.lateSubmissionRate.value}%`, subtitle: summary.lateSubmissionRate.comparisonLabel, subValue: `${summary.lateSubmissionRate.change}%` },
  ];

  return (
    <div className="flex flex-col flex-1 w-full h-screen space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-indigo-700">
          Welcome back, {userName}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {kpiData.map((item, index) => (
          <KpiCardComponent
            key={index}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            subValue={item.subValue}
          />
        ))}
      </div>

      <div className="flex flex-col w-full gap-6 lg:flex-row">
        <div className="flex flex-col flex-1 space-y-6">
          <div className="p-5 bg-white shadow-sm rounded-2xl">
            <p className="mb-4 text-2xl font-medium text-linear-main">
              Submission Trend
            </p>

            <div className="w-full rounded-xl">
              <SubmissionTrendComponent 
                role="teacher" 
                data={submissionTrend} 
              />
            </div>
          </div>

          <StudentProgressComponent 
            progress={studentProgress} 
          />
        </div>

        <div className="flex flex-col flex-1 space-y-6">
          <RecentTaskComponent 
            tasks={recentTasks} 
          />

          <div className="flex flex-col w-full gap-4 md:flex-row">
            <div className="flex flex-col justify-between w-full h-full p-5 shadow-sm bg-linear-purple rounded-2xl md:w-3/5">
              <CurrentTaskComponent 
                tasks={currentTasks} 
              />
            </div>

            <div className="flex flex-col justify-between w-full h-full p-5 bg-white shadow-sm md:w-2/5 rounded-2xl text-black">
              <ReminderComponent 
                reminder={reminder} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
