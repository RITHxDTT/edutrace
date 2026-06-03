'use client'

import React, { use } from 'react';
import KpiCardComponent from './KpiCard/KpiCardComponent';
import SubmissionTrendComponent from './SubmissionTrend/SubmissionTrendComponent';
import WeeklyVsRequiredProgress from './WeeklyVsRequiredProgress/WeeklyVsRequiredProgress';
import ActivityLogComponent from './ActivityLog/ActivityLogComponent';
import PieChartWithCenterLabel from './PieChartWithCenterLabel/PieChartWithCenterLabelComponent';
import { DashboardStudentPayload } from '@/types/dashboard';

interface StudentDashboardProps {
  dataPromise: Promise<DashboardStudentPayload>;
  userName: string;
}

export default function StudentDashboard({ dataPromise, userName }: StudentDashboardProps) {
  const data = use(dataPromise);

  if (!data) return null;

  const { summary, scoreTrendOverTasks, submissionTrendsDonut, weeklyVsRequiredProgress, activityLogs } = data;

  const kpiData = [
    { title: "Task Assigned", value: summary.taskAssigned.value, subtitle: "Active now", subValue: summary.taskAssigned.activeNow.toString() },
    { title: "Task Completed", value: summary.taskCompleted.value, subtitle: "Completion", subValue: `${summary.taskCompleted.completionRate}%` },
    { title: "Total Hours Logged", value: summary.totalHoursLogged.value, subtitle: "This month", subValue: `${summary.totalHoursLogged.thisMonthHours}hrs` },
    { title: "On-Time Rate", value: `${summary.onTimeRate.value}%`, subtitle: "Submitted", subValue: `${summary.onTimeRate.submittedCount}/${summary.onTimeRate.totalSubmissionCount}` },
  ];

  return (
    <div className="flex flex-col flex-1 w-full h-screen space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-indigo-700">
          Welcome back, {userName}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="flex flex-col w-full gap-5 xl:flex-row">
        <div className="w-full space-y-5">
          <div className="flex flex-col w-full gap-6 lg:flex-row">
            <div className="w-full h-74.25 overflow-hidden bg-white rounded-2xl shadow-sm p-6">
              <p className="mb-6 text-2xl font-medium text-linear-main">
                Score Trend Over Tasks
              </p>

              <div className="w-full h-full">
                <SubmissionTrendComponent 
                  role="student" 
                  data={scoreTrendOverTasks} 
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-6 shadow-sm h-74.25 lg:w-100">
              <p className="mb-4 text-2xl font-medium text-center text-linear-main">
                Submission Trends
              </p>

              <div className="flex items-center justify-center flex-1 w-full">
                <PieChartWithCenterLabel 
                  data={submissionTrendsDonut?.data}
                  centerLabel={submissionTrendsDonut?.centerLabel}
                />
              </div>
            </div>
          </div>

          <WeeklyVsRequiredProgress 
            data={weeklyVsRequiredProgress} 
          />
        </div>

        <div className="w-full xl:w-105">
          <ActivityLogComponent 
            logs={activityLogs} 
          />
        </div>
      </div>
    </div>
  );
}
