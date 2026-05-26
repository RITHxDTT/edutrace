"use client";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import styles from './kpicard.module.css';
import SubmissionTrendComponent from "./_components/SubmissionTrend/SubmissionTrendComponent";
import { BarChart } from '@mui/x-charts/BarChart';
import PieChartWithCenterLabel from "./_components/PieChartWithCenterLabel/PieChartWithCenterLabelComponent";
import KpiCardComponent from "../dashboard/_components/KpiCard/KpiCardComponent";
import Image from "next/image";
import StudentProgressComponent from "./_components/StudentProgress/StudentProgressComponent";
import RecentTaskComponent from "./_components/RecentTask/RecentTaskComponent";
import CurrentTaskComponent from "./_components/CurrentTask/CurrentTaskComponent";
import ReminderComponent from "./_components/Reminder/ReminderComponent";
import WeeklyVsRequiredProgress from "./_components/WeeklyVsRequiredProgress/WeeklyVsRequiredProgress";
import ActivityLogComponent from "./_components/ActivityLog/ActivityLogComponent";

export default function Page() {
  const isTeacher = false;
  const isStudent = true;


  const res = {
    "success": true,
    "message": "Teacher dashboard retrieved successfully",
    "payload": {
      "summary": {
        "totalTasks": 5,
        "totalSubmissionRate": 88,
        "lateSubmissionRate": 19,
        "atRiskStudents": 3
      },
      "submissionTrend": {
        "title": "Submission Trend",
        "xLabel": "Day",
        "yLabel": "Submissions",
        "legend": [
          {
            "key": "onTime",
            "label": "On-Time"
          },
          {
            "key": "lateSubmission",
            "label": "Late Submission"
          }
        ],
        "data": [
          {
            "day": "Mon",
            "onTime": 2,
            "lateSubmission": 0
          },
          {
            "day": "Tue",
            "onTime": 2,
            "lateSubmission": 0
          },
          {
            "day": "Wed",
            "onTime": 0,
            "lateSubmission": 1
          },
          {
            "day": "Thu",
            "onTime": 0,
            "lateSubmission": 0
          },
          {
            "day": "Fri",
            "onTime": 0,
            "lateSubmission": 0
          },
          {
            "day": "Sat",
            "onTime": 0,
            "lateSubmission": 0
          },
          {
            "day": "Sun",
            "onTime": 0,
            "lateSubmission": 0
          }
        ]
      },
      "recentTasks": [
        {
          "assessmentId": "81000000-0000-4000-8000-000000000201",
          "taskName": "REST API Design Sprint",
          "classroomId": "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
          "className": "PP-class",
          "classroomAbbre": "PP",
          "deadline": "2026-05-10T16:59:00Z",
          "submissionRate": 88,
          "status": "CLOSED"
        },
        {
          "assessmentId": "81000000-0000-4000-8000-000000000202",
          "taskName": "Spring Boot Capstone Checkpoint",
          "classroomId": "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
          "className": "PP-class",
          "classroomAbbre": "PP",
          "deadline": "2026-05-27T16:59:00Z",
          "submissionRate": 100,
          "status": "IN_PROGRESS"
        },
        {
          "assessmentId": "81000000-0000-4000-8000-000000000203",
          "taskName": "Database Indexing Lab",
          "classroomId": "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
          "className": "PP-class",
          "classroomAbbre": "PP",
          "deadline": "2026-05-06T16:59:00Z",
          "submissionRate": 50,
          "status": "CLOSED"
        },
        {
          "assessmentId": "81000000-0000-4000-8000-000000000204",
          "taskName": "Web Accessibility Audit",
          "deadline": "2026-06-05T16:59:00Z",
          "submissionRate": 0,
          "status": "NOT_YET"
        }
      ],
      "studentProgress": [
        {
          "studentId": "82000000-0000-4000-8000-000000000104",
          "studentName": "Ratha Tep",
          "email": "ratha.tep@student.hrdroom.test",
          "profileImage": "https://assets.hrdroom.local/avatars/ratha-tep.png",
          "classroomId": "61dc18eb-f3c4-48b1-99d6-c0978146f367",
          "className": "Siem Reap",
          "classroomAbbre": "SR",
          "averageScore": 63,
          "completionRate": 100,
          "lateRate": 67,
          "gradedTaskCount": 3,
          "status": "AT_RISK"
        },
        {
          "studentId": "82000000-0000-4000-8000-000000000105",
          "studentName": "Sreynich Orn",
          "email": "sreynich.orn@student.hrdroom.test",
          "profileImage": "https://assets.hrdroom.local/avatars/sreynich-orn.png",
          "classroomId": "61dc18eb-f3c4-48b1-99d6-c0978146f367",
          "className": "Siem Reap",
          "classroomAbbre": "SR",
          "averageScore": 63,
          "completionRate": 67,
          "lateRate": 50,
          "gradedTaskCount": 2,
          "status": "AT_RISK"
        },
        {
          "studentId": "82000000-0000-4000-8000-000000000103",
          "studentName": "Malin Chan",
          "email": "malin.chan@student.hrdroom.test",
          "profileImage": "https://assets.hrdroom.local/avatars/malin-chan.png",
          "classroomId": "61dc18eb-f3c4-48b1-99d6-c0978146f367",
          "className": "Siem Reap",
          "classroomAbbre": "SR",
          "averageScore": 68,
          "completionRate": 100,
          "lateRate": 33,
          "gradedTaskCount": 3,
          "status": "AT_RISK"
        }
      ],
      "currentTasks": [
        {
          "assessmentId": "81000000-0000-4000-8000-000000000202",
          "taskName": "Spring Boot Capstone Checkpoint",
          "classroomId": "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
          "className": "PP-class",
          "classroomAbbre": "PP",
          "startAt": "2026-05-13T02:00:00Z",
          "dueAt": "2026-05-27T16:59:00Z",
          "submissionRate": 100,
          "status": "IN_PROGRESS"
        }
      ],
      "reminder": {
        "title": "Spring Boot Capstone Checkpoint Right Now?",
        "description": "This meeting has 8 students.",
        "actionLabel": "Start Meeting",
        "assessmentId": "81000000-0000-4000-8000-000000000202",
        "meetingRoomId": "8a000000-0000-4000-8000-000000000902"
      }
    },
    "status": 200,
    "path": "/api/v1/dashboard/teacher",
    "timestamp": "2026-05-21T06:22:18.302679330Z"
  }
  // const submissionTrend = res.payload.submissionTrend;

  const summery: Summery[] = [
    { title: "Total tasks", value: "56", subtitle: "Increase from last task.", subValue: "1", allowedRoles: ['instructor'] },
    { title: "Total Submission", value: "10%", subtitle: "Increase from last task.", subValue: "1", allowedRoles: ['instructor'] },
    { title: "Late Submission", value: "56%", subtitle: "Increase from last task.", subValue: "1", allowedRoles: ['instructor'] },
    { title: "At-risk students", value: "20", subtitle: "Increase from last task.", subValue: "1", allowedRoles: ['instructor'] },
    { title: "Task Assigned", value: "8", subtitle: "Increase from last task.", subValue: "+12%", allowedRoles: ['student'] },
    { title: "Task Completed", value: "5", subtitle: "Increase from last task.", subValue: "+3%", allowedRoles: ['student'] },
    { title: "Total Hours Logged ", value: "14.5", subtitle: "Increase from last task.", subValue: "+12%", allowedRoles: ['student'] },
    { title: "On-Time Rate", value: "14%", subtitle: "Increase from last task.", subValue: "+3%", allowedRoles: ['student'] }
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
            {summery.slice(0, 4).map((summery, index) => (
              <KpiCardComponent
                key={index}
                title={summery.title}
                value={summery.value}
                subtitle={summery.subtitle}
                subValue={summery.subValue}
              />
            ))}
          </div>

          {/* ========= Graph And Table ==========  */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="flex flex-col space-y-6 flex-1 w-full">
              <div className="bg-white text-black rounded-2xl p-5 shadow-sm">
                <p className="text-2xl font-medium mb-4 text-gray-800">Submission Trend</p>
                <div className="w-full bg-transparent rounded-xl">
                  <SubmissionTrendComponent />
                </div>
              </div>
              <div>
                <StudentProgressComponent />
              </div>
            </div>

            <div className="flex flex-col space-y-6 flex-1 w-full">
              <div className="w-full">
                <RecentTaskComponent />
              </div>

              {/* ==>> Current Task */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="bg-[#2425aa] rounded-2xl shadow-sm p-5 w-full h-full md:w-3/5 flex flex-col justify-between">

                  <CurrentTaskComponent />
                </div>
                <div className="flex flex-col justify-between bg-white h-full text-black rounded-2xl shadow-sm p-5 w-full md:w-2/5 ">
                  <ReminderComponent />
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

        {/* ========= Card ========== */}
        <div>
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
            {summery.slice(0, 4).map((summery, index) => (
              <KpiCardComponent
                key={index}
                title={summery.title}
                value={summery.value}
                subtitle={summery.subtitle}
                subValue={summery.subValue}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between w-full  gap-5 ">
          {/* ========= Graph Block ==========*/}
          <div className="space-y-5 w-full ">
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <div className="w-full h-[297px] bg-white rounded-2xl p-6 shadow-sm overflow-hidden">
                <p className="text-3xl font-medium mb-6 text-gray-800">
                  Show how student change task by task
                </p>
                <div className="w-full h-full">
                  <SubmissionTrendComponent />
                </div>
              </div>

              <div className="h-[297px] bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center">
                <p className="text-3xl font-medium mb-4 text-gray-800 text-center">
                  Submission Trends
                </p>

                <div className="flex-1 flex justify-center items-center w-full">
                  <PieChartWithCenterLabel />
                </div>
              </div>
            </div>

            <div className="w-full">
              <WeeklyVsRequiredProgress />
            </div>
          </div>

          {/* ========= The Acivity Log ==========*/}
          <div className="md:w-122">
            <ActivityLogComponent />
          </div>

        </div>
      </div>
    );
  }
}

