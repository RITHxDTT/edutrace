import { Assessment, Student, ActivityLog, SessionLog } from "./types";

// ── Storage Key ───────────────────────────────────────────────────────────────

export const STORAGE_KEY = "assessments";

// ── Assessments ───────────────────────────────────────────────────────────────

export const DEFAULT_ASSESSMENTS: Assessment[] = [
  {
    id: 1,
    title: "Web Development",
    category: "Web",
    startDate: "09th May 2026",
    endDate: "13th May 2026",
    points: 100,
  },
  {
    id: 2,
    title: "UI/UX Design Basics",
    category: "Design",
    startDate: "10th May 2026",
    endDate: "15th May 2026",
    points: 80,
  },
  {
    id: 3,
    title: "Database Management",
    category: "Database",
    startDate: "11th May 2026",
    endDate: "18th May 2026",
    points: 90,
  },
];

// ── Students ──────────────────────────────────────────────────────────────────

export const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Chhorn Chamreun",
    avatar: "/images/profile/ReournChormrern.avif",
    file: "16_CHHORN_CHAMREUN_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "42 MB",
    status: "Handed In",
  },
  {
    id: 2,
    name: "Keo Vuthana",
    avatar: "/images/profile/KeoVuthtana.jpg",
    file: "09_KEO_VUTHANA_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "42 MB",
    status: "Handed In",
  },
  {
    id: 3,
    name: "Chea Penghoung",
    avatar: "/images/profile/Penghurng.avif",
    file: "02_CHEA_PENGHOUNG_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "42 MB",
    status: "Handed In",
  },
  {
    id: 4,
    name: "Uy Chakriya",
    avatar: "/images/profile/UyChakriya.jpg",
    file: "18_UY_CHAKRIYA_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "",
    status: "Handed In",
  },
  {
    id: 5,
    name: "Yann Vanneth",
    avatar: "/images/profile/YannVannet.jpg",
    file: "12_YANN_VANNETH_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "42 MB",
    status: "Handed In",
  },
  {
    id: 6,
    name: "Chhor Vichey",
    avatar: "/images/profile/Vichey.avif",
    file: "14_CHHOR_VICHEY_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "",
    status: "Pending",
  },
  {
    id: 7,
    name: "Horn Vanhong",
    avatar: "/images/profile/Vannhong.jpg",
    file: "15_HORN_VANHONG_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "18 MB",
    status: "Pending",
  },
];

// ── Activity Log ──────────────────────────────────────────────────────────────

export const MOCK_ACTIVITY_LOG: ActivityLog[] = [
  {
    id: 1,
    type: "submit",
    student: "Chhor Vichey",
    action: "Assignment Submitted",
    file: "14_CHHOR_VICHEY_WEB_SR_001.zip",
    datetime: "13th May 2026, 11:00 PM",
  },
  {
    id: 2,
    type: "submit",
    student: "Chea Penghoung",
    action: "Assignment Submitted",
    file: "02_CHEA_PENGHOUNG_WEB_SR_001.zip",
    datetime: "13th May 2026, 11:00 PM",
  },
  {
    id: 3,
    type: "submit",
    student: "Keo Vuththana",
    action: "Assignment Submitted",
    file: "10_KEO_VUTHTHANA_WEB_SR_001.zip",
    datetime: "12th May 2026, 3:00 PM",
  },
  {
    id: 4,
    type: "score",
    student: "Score Given",
    action: "",
    file: "You have set score on Uy Chakriya's assignment",
    datetime: "12th Mar 2026, 11:00 PM",
  },
  {
    id: 5,
    type: "feedback",
    student: "Feedback Given",
    action: "",
    file: "You have feedback on Uy Chakriya's assignment",
    datetime: "12th Mar 2026, 11:00 PM",
  },
  {
    id: 6,
    type: "submit",
    student: "Try Limhai",
    action: "Assignment Submitted",
    file: "15_TRY_LIMHAI_WEB_SR_001.zip",
    datetime: "12th May 2026, 11:00 PM",
  },
];

// ── Session Log ───────────────────────────────────────────────────────────────

export const MOCK_SESSION_LOG: SessionLog[] = [
  {
    id: 1,
    date: "12th May 2026",
    start: "8:00 AM",
    end: "8:25 AM",
    duration: 240,
    status: "Completed",
  },
  {
    id: 2,
    date: "11th May 2026",
    start: "3:10 PM",
    end: "5:10 PM",
    duration: 120,
    status: "Completed",
  },
  {
    id: 3,
    date: "10th May 2026",
    start: "7:00 PM",
    end: "8:30 PM",
    duration: 150,
    status: "Completed",
  },
];

// ── Student Time Constants ────────────────────────────────────────────────────

export const DAILY_REQUIRED = 60;
export const TIME_SPENT_TODAY = 45;
