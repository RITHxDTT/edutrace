// // const submissionTrend = res.payload.submissionTrend;
//
// export const studentProgress = [
//     {
//         id: 1,
//         name: 'Yann Vannet',
//         email: 'yannvannet@gmail.com',
//         image: '/images/profile/YannVannet.jpg',
//         completion: '100%',
//         late: '2%',
//         status: 'Good',
//         statusColor: 'bg-[#EBF9F1] text-[#1F9254] font-medium',
//     },
//
//     {
//         id: 2,
//         name: 'Uy Chakriya',
//         email: 'uychakriya@gmail.com',
//         image: '/images/profile/UyChakriya.jpg',
//         completion: '95%',
//         late: '5%',
//         status: 'Good',
//         statusColor: 'bg-[#EBF9F1] text-[#1F9254] font-medium',
//     },
//
//     {
//         id: 3,
//         name: 'Try Limhai',
//         email: 'trilimhai@gmail.com',
//         image: '/images/profile/TryLihai.jpg',
//         completion: '45%',
//         late: '55%',
//         status: 'At Risk',
//         statusColor: 'bg-[#FBE7E8] text-[#B91C1C] font-medium',
//     },
// ];
//
// export const submissionTrend = [
//     { value: 5, label: 'Missed', color: '#8979FF', role: ['teacher'] },
//     { value: 10, label: 'On Time', color: '#962DFF', role: ['teacher'] },
//     { value: 15, label: 'Late', color: '#C6D2FD', role: ['teacher'] },
// ];
//
// export const size = {
//     width: 200,
//     height: 200,
// };
//
// export const recentTasks: RecentTask[] = [
//     { id: "1", name: "Web-Homework-002 (Css Ba...", deadline: "Apr 07, 2026", submission: "60%", status: "Overdue" },
//     { id: "2", name: "Java Mini Project 1", deadline: "Apr 07, 2026", submission: "100%", status: "Finish" },
//     { id: "3", name: "Web-MiniProject001", deadline: "Apr 07, 2026", submission: "60%", status: "Overdue" },
//     { id: "4", name: "Java Mini Project 1", deadline: "Apr 07, 2026", submission: "100%", status: "Finish" },
// ];
//
// export const activityLogs: ActivityLogItem[] = [
//     { id: 1, message: 'You have joined Web Development room', timestamp: '11th May 2026, 2:00 PM', type: 'join' },
//     { id: 2, message: 'You have left Web Development room', timestamp: '11th May 2026, 5:00 PM', type: 'leave' },
//     { id: 3, message: 'You have joined Java Mini-Project 002', timestamp: '11th May 2026, 2:00 PM', type: 'join' },
//     { id: 4, message: 'You have left Java Mini-Project 002', timestamp: '11th May 2026, 5:00 PM', type: 'leave' },
//     { id: 5, message: 'You have left Web Development room', timestamp: '11th May 2026, 5:00 PM', type: 'leave' },
// ];
//
// export const summery: Summery[] = [
//     { title: "Total tasks", value: "56", subtitle: "Classes", subValue: "3", role: ['teacher'] },
//     { title: "Ative Tasks", value: "20", subtitle: "Increase from last task.", subValue: "1", role: ['teacher'] },
//     { title: "At-risk students", value: "5", subtitle: "need attention", subValue: "1", role: ['teacher'] },
//     { title: "Total Submission", value: "78%", subtitle: "this week", subValue: "4%", role: ['teacher'] },
//     { title: "Late Submission rate", value: "56%", subtitle: "vs last week", subValue: "3%", role: ['teacher'] },
//
//
//     { title: "Task Assigned", value: "8", subtitle: "Active now", subValue: "3", role: ['student'] },
//     { title: "Task Completed", value: "5", subtitle: "Completion.", subValue: "63%", role: ['student'] },
//     { title: "Total Hours Logged ", value: "14.5", subtitle: "This month", subValue: "3hrs", role: ['student'] },
//     { title: "On-Time Rate", value: "14%", subtitle: "Submitted", subValue: "4/5", role: ['student'] }
// ];
//
// export const student = {
//     "success": true,
//     "message": "Dashboard retrieved successfully",
//     "payload": {
//         "student": {
//             "studentId": "a0352dc1-8e61-410c-a4ec-cbdd531ffc51",
//             "studentName": "Sokpiseth Nheoun",
//             "email": "ahboy5518@gmail.com",
//             "profileImageUrl": "https://sulk-valid-avenging.ngrok-free.dev/api/v1/files/2f1c1c86-5038-4ffe-96fd-6d29d63cb501.jpg",
//             "classroomId": "61dc18eb-f3c4-48b1-99d6-c0978146f367",
//             "className": "Siem Reap",
//             "classroomAbbre": "SR"
//         },
//         "summary": {
//             "taskAssigned": {
//                 "value": 3,
//                 "activeNow": 1
//             },
//             "taskCompleted": {
//                 "value": 0,
//                 "completionRate": 0
//             },
//             "totalHoursLogged": {
//                 "value": 0,
//                 "thisMonthHours": 0
//             },
//             "onTimeRate": {
//                 "value": 0,
//                 "submittedCount": 0,
//                 "totalSubmissionCount": 0
//             }
//         },
//         "scoreTrendOverTasks": {
//             "title": "Score Trend over Tasks",
//             "description": "Shows how the student's scores have changed task by task",
//             "xLabel": "Task",
//             "yLabel": "Score (%)",
//             "legend": [
//                 {
//                     "key": "yourScore",
//                     "label": "Your Score"
//                 },
//                 {
//                     "key": "classAverageScore",
//                     "label": "Class Average"
//                 }
//             ],
//             "data": [
//                 {
//                     "taskId": "81000000-0000-4000-8000-000000000203",
//                     "taskLabel": "Database Indexing Lab",
//                     "classAverageScore": 79
//                 },
//                 {
//                     "taskId": "81000000-0000-4000-8000-000000000201",
//                     "taskLabel": "REST API Design Sprint",
//                     "classAverageScore": 80
//                 },
//                 {
//                     "taskId": "81000000-0000-4000-8000-000000000202",
//                     "taskLabel": "Spring Boot Capstone Checkpoint",
//                     "classAverageScore": 72
//                 }
//             ]
//         },
//         "submissionTrendsDonut": {
//             "title": "Submission Trends",
//             "centerLabel": "Overall",
//             "data": [
//                 {
//                     "status": "MISSED",
//                     "label": "Missed",
//                     "count": 2,
//                     "percentage": 100
//                 },
//                 {
//                     "status": "ON_TIME",
//                     "label": "On Time",
//                     "count": 0,
//                     "percentage": 0
//                 },
//                 {
//                     "status": "LATE",
//                     "label": "Late",
//                     "count": 0,
//                     "percentage": 0
//                 }
//             ]
//         },
//         "weeklyVsRequiredProgress": {
//             "title": "Weekly vs Required Progress",
//             "xLabel": "Week",
//             "yLabel": "Hours",
//             "legend": [
//                 {
//                     "key": "loggedHours",
//                     "label": "Logged"
//                 },
//                 {
//                     "key": "requiredHours",
//                     "label": "Required"
//                 }
//             ],
//             "data": [
//                 {
//                     "week": "Week 1",
//                     "loggedHours": 0,
//                     "requiredHours": 9
//                 },
//                 {
//                     "week": "Week 2",
//                     "loggedHours": 0,
//                     "requiredHours": 13.5
//                 },
//                 {
//                     "week": "Week 3",
//                     "loggedHours": 0,
//                     "requiredHours": 10
//                 },
//                 {
//                     "week": "Week 4",
//                     "loggedHours": 0,
//                     "requiredHours": 14
//                 },
//                 {
//                     "week": "Week 5",
//                     "loggedHours": 0,
//                     "requiredHours": 6
//                 }
//             ]
//         },
//         "activityLogs": [
//             {
//                 "activityId": "659f90a2-94a6-4e4d-abf4-68fff9e7f53a",
//                 "type": "LEAVE_MEETING",
//                 "message": "You have left a meeting room",
//                 "createdAt": "2026-05-26T03:26:04.104633Z"
//             },
//             {
//                 "activityId": "52f1cdea-9986-46ab-8bde-20bed48d8a28",
//                 "type": "JOIN_MEETING",
//                 "message": "You have joined a meeting room",
//                 "createdAt": "2026-05-26T03:25:21.750273Z"
//             },
//             {
//                 "activityId": "b1d4ae0f-14cb-4f4f-b1d2-14a7b0047ffb",
//                 "type": "LEAVE_MEETING",
//                 "message": "You have left a meeting room",
//                 "createdAt": "2026-05-26T03:25:16.148773Z"
//             },
//             {
//                 "activityId": "fe87552b-3130-4c97-8956-0cb5d82ac037",
//                 "type": "JOIN_MEETING",
//                 "message": "You have joined a meeting room",
//                 "createdAt": "2026-05-26T03:24:34.983995Z"
//             },
//             {
//                 "activityId": "1b3cff3f-3971-458d-9dcc-08c0a0fb1999",
//                 "type": "LEAVE_MEETING",
//                 "message": "You have left a meeting room",
//                 "createdAt": "2026-05-26T03:24:26.186453Z"
//             }
//         ]
//     },
//     "status": 200,
//     "path": "/api/v1/dashboard",
//     "timestamp": "2026-05-26T12:49:49.497501651Z"
// }
//
// export const teacher = {
//     "success": true,
//     "message": "Teacher dashboard retrieved successfully",
//     "payload": {
//         "summary": {
//             "totalTasks": {
//                 "value": 3,
//                 "totalClasses": 2
//             },
//             "activeTasks": {
//                 "value": 3
//             },
//             "submissionRate": {
//                 "value": 0,
//                 "change": 5.26,
//                 "changeDirection": "DECREASE",
//                 "comparisonLabel": "vs last week"
//             },
//             "lateSubmissionRate": {
//                 "value": 0,
//                 "change": 0,
//                 "changeDirection": "NO_CHANGE",
//                 "comparisonLabel": "vs last week"
//             },
//             "atRiskStudents": {
//                 "value": 1
//             }
//         },
//         "submissionTrend": {
//             "title": "Submission Trend",
//             "xLabel": "Day",
//             "yLabel": "Submissions",
//             "legend": [
//                 {
//                     "key": "onTime",
//                     "label": "On-Time"
//                 },
//                 {
//                     "key": "lateSubmission",
//                     "label": "Late Submission"
//                 }
//             ],
//             "data": [
//                 {
//                     "day": "Mon",
//                     "onTime": 0,
//                     "lateSubmission": 0
//                 },
//                 {
//                     "day": "Tue",
//                     "onTime": 0,
//                     "lateSubmission": 0
//                 },
//                 {
//                     "day": "Wed",
//                     "onTime": 0,
//                     "lateSubmission": 0
//                 },
//                 {
//                     "day": "Thu",
//                     "onTime": 0,
//                     "lateSubmission": 0
//                 },
//                 {
//                     "day": "Fri",
//                     "onTime": 0,
//                     "lateSubmission": 0
//                 },
//                 {
//                     "day": "Sat",
//                     "onTime": 0,
//                     "lateSubmission": 0
//                 },
//                 {
//                     "day": "Sun",
//                     "onTime": 0,
//                     "lateSubmission": 0
//                 }
//             ]
//         },
//         "recentTasks": [
//             {
//                 "assessmentId": "22498b15-7b8d-4e36-ab3e-ddf4a1b1a162",
//                 "taskName": "app1",
//                 "classroomId": "61dc18eb-f3c4-48b1-99d6-c0978146f367",
//                 "className": "Siem Reap",
//                 "classroomAbbre": "SR",
//                 "deadline": "2026-05-26T17:00:00Z",
//                 "submissionRate": 0,
//                 "status": "IN_PROGRESS"
//             },
//             {
//                 "assessmentId": "591d93a3-417d-4aaa-b317-70ad957e462c",
//                 "taskName": "new by 8080",
//                 "classroomId": "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
//                 "className": "PP-class",
//                 "classroomAbbre": "PP",
//                 "deadline": "2026-05-29T09:47:22.840Z",
//                 "submissionRate": 0,
//                 "status": "IN_PROGRESS"
//             },
//             {
//                 "assessmentId": "23936d59-9280-4e11-a274-6a45f7cd8b04",
//                 "taskName": "TEST zin",
//                 "classroomId": "61dc18eb-f3c4-48b1-99d6-c0978146f367",
//                 "className": "Siem Reap",
//                 "classroomAbbre": "SR",
//                 "deadline": "2026-05-23T06:37:00Z",
//                 "submissionRate": 5,
//                 "status": "IN_PROGRESS"
//             }
//         ],
//         "studentProgress": [
//             {
//                 "studentId": "a0352dc1-8e61-410c-a4ec-cbdd531ffc51",
//                 "studentName": "Sokpiseth Nheoun",
//                 "email": "ahboy5518@gmail.com",
//                 "profileImage": "https://sulk-valid-avenging.ngrok-free.dev/api/v1/files/2f1c1c86-5038-4ffe-96fd-6d29d63cb501.jpg",
//                 "classroomId": "61dc18eb-f3c4-48b1-99d6-c0978146f367",
//                 "className": "Siem Reap",
//                 "classroomAbbre": "SR",
//                 "averageScore": 10,
//                 "completionRate": 33,
//                 "lateRate": 0,
//                 "gradedTaskCount": 1,
//                 "status": "AT_RISK"
//             }
//         ],
//         "currentTasks": [
//             {
//                 "assessmentId": "22498b15-7b8d-4e36-ab3e-ddf4a1b1a162",
//                 "taskName": "app1",
//                 "classroomId": "61dc18eb-f3c4-48b1-99d6-c0978146f367",
//                 "className": "Siem Reap",
//                 "classroomAbbre": "SR",
//                 "startAt": "2026-05-25T11:43:57.376Z",
//                 "dueAt": "2026-05-26T17:00:00Z",
//                 "submissionRate": 0,
//                 "status": "IN_PROGRESS"
//             },
//             {
//                 "assessmentId": "591d93a3-417d-4aaa-b317-70ad957e462c",
//                 "taskName": "new by 8080",
//                 "classroomId": "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
//                 "className": "PP-class",
//                 "classroomAbbre": "PP",
//                 "startAt": "2026-05-24T09:47:22.840Z",
//                 "dueAt": "2026-05-29T09:47:22.840Z",
//                 "submissionRate": 0,
//                 "status": "IN_PROGRESS"
//             }
//         ],
//         "reminder": {
//             "title": "app1 Right Now?",
//             "description": "This meeting has 23 students.",
//             "actionLabel": "Start Meeting",
//             "assessmentId": "22498b15-7b8d-4e36-ab3e-ddf4a1b1a162",
//             "meetingRoomId": "050cb104-f07e-44b2-a235-b3a83fa0212b"
//         }
//     },
//     "status": 200,
//     "path": "/api/v1/dashboard",
//     "timestamp": "2026-05-27T02:30:17.811538609Z"
// }