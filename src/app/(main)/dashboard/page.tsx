'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@heroui/table';
import Image from 'next/image';

import styles from './kpicard.module.css';

import SubmissionTrendComponent from './_components/SubmissionTrend/SubmissionTrendComponent';
import PieChartWithCenterLabel from './_components/PieChartWithCenterLabel/PieChartWithCenterLabelComponent';
import KpiCardComponent from '../dashboard/_components/KpiCard/KpiCardComponent';
import StudentProgressComponent from './_components/StudentProgress/StudentProgressComponent';
import RecentTaskComponent from './_components/RecentTask/RecentTaskComponent';
import CurrentTaskComponent from './_components/CurrentTask/CurrentTaskComponent';
import ReminderComponent from './_components/Reminder/ReminderComponent';
import WeeklyVsRequiredProgress from './_components/WeeklyVsRequiredProgress/WeeklyVsRequiredProgress';
import ActivityLogComponent from './_components/ActivityLog/ActivityLogComponent';

import { summery } from './mockupData';

export default function Page() {
  const isTeacher = false;
  const isStudent = true;

  return (
    <>

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

      {/* ========================= TEACHER ========================= */}
      {isTeacher && (
        <div className="flex flex-col flex-1 w-full h-screen p-6 overflow-y-auto space-y-5 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-semibold text-indigo-700">
              Welcome back, Tan Dara
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {summery.slice(0, 5).map((item, index) => (
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
                  <SubmissionTrendComponent />
                </div>
              </div>

              <StudentProgressComponent />
            </div>


            <div className="flex flex-col flex-1 space-y-6">
              <RecentTaskComponent />
              <div className="flex flex-col w-full gap-4 md:flex-row">
                <div className="flex flex-col justify-between w-full h-full p-5 shadow-sm bg-[#2425aa] rounded-2xl md:w-3/5">
                  <CurrentTaskComponent />
                </div>

                <div className="flex flex-col justify-between w-full h-full p-5 bg-white shadow-sm md:w-2/5 rounded-2xl text-black">
                  <ReminderComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================= STUDENT ========================= */}
      {isStudent && (
        <div className="flex flex-col flex-1 w-full h-screen p-6 overflow-y-auto space-y-5 text-white">

          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-semibold text-indigo-700">
              Welcome back, Uy Chakriya
            </h1>
          </div>


          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {summery.slice(0, 4).map((item, index) => (
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

                <div className="w-full h-[297px] overflow-hidden bg-white rounded-2xl p-6 shadow-sm">
                  <p className="mb-6 text-2xl font-medium text-linear-main">
                    Show how student change task by task
                  </p>

                  <div className="w-full h-full">
                    <SubmissionTrendComponent />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-6 shadow-sm h-[297px] lg:w-[400px]">
                  <p className="mb-4 text-2xl font-medium text-center text-linear-main">
                    Submission Trends
                  </p>

                  <div className="flex items-center justify-center flex-1 w-full">
                    <PieChartWithCenterLabel />
                  </div>
                </div>
              </div>
              <WeeklyVsRequiredProgress />
            </div>


            <div className="w-full xl:w-[420px]">
              <ActivityLogComponent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}