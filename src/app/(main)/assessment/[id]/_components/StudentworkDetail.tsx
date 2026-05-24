"use client";

import { useState } from "react";
import styles from "../studentwork.module.css";

function CalendarIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function FileIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "#6b5ef8",
    "#22d3a0",
    "#f5a623",
    "#f56565",
    "#3b82f6",
    "#ec4899",
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <div className={styles.avatar} style={{ background: colors[colorIndex] }}>
      {initials}
    </div>
  );
}

const students = [
  {
    name: "Chhorn Chamreun",
    file: "16_CHHORN_CHAMRE...",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "42.MB",
    status: "Handed In",
  },
  {
    name: "Keo Vuthana",
    file: "09_KEO_VUTHTHAN...",
    date: "13 May 2026",
    time: "11:00 PM",
    size: null,
    status: "Handed In",
  },
  {
    name: "Chea Penghoung",
    file: "02_CHEA_PENGHOU...",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "42.MB",
    status: "Handed In",
  },
  {
    name: "Uy Chakriya",
    file: "18_UY_CHAKRIYA_S...",
    date: "13 May 2026",
    time: "11:00 PM",
    size: null,
    status: "Handed In",
  },
  {
    name: "Yann Vanneth",
    file: "12_YANN_VANNETH_...",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "42.MB",
    status: "Handed In",
  },
  {
    name: "Chhor Vichey",
    file: "14_CHHOR_VICHEY_...",
    date: "13 May 2026",
    time: "11:00 PM",
    size: null,
    status: "Handed In",
  },
  {
    name: "Chhor Vichey",
    file: "14_CHHOR_VICHEY_...",
    date: "13 May 2026",
    time: "11:00 PM",
    size: null,
    status: "Handed In",
  },
];

const activityLog = [
  {
    type: "submit",
    text: "Assignment Submitted",
    student: "Chhor Vichey",
    file: "14_TRY_LIMHAI_WEB_SR_001.zip",
    datetime: "13th May 2026, 11:00 PM",
    color: "#22d3a0",
    colorBg: "rgba(34,211,160,0.15)",
  },
  {
    type: "submit",
    text: "Assignment Submitted",
    student: "Chea Penghoung",
    file: "02_CHEA_PENGHOUNG_WEB_SR_001.zip",
    datetime: "13th May 2026, 11:00 PM",
    color: "#22d3a0",
    colorBg: "rgba(34,211,160,0.15)",
  },
  {
    type: "submit",
    text: "Assignment Submitted",
    student: "Keo Vuththana",
    file: "10_KEO_VUTHTHANA_WEB_SR_001.zip",
    datetime: "12th May 2026, 3:00 PM",
    color: "#22d3a0",
    colorBg: "rgba(34,211,160,0.15)",
  },
  {
    type: "score",
    text: "Score Given",
    student: null,
    file: "You have set score on Uy Chakriya's assignment",
    datetime: "12th Mar 2026, 11:00PM",
    color: "#4b5ef8",
    colorBg: "rgba(75,94,248,0.15)",
  },
  {
    type: "feedback",
    text: "Feedback Given",
    student: null,
    file: "You have feedback on Uy Chakriya's assignment",
    datetime: "12th Mar 2026, 11:00PM",
    color: "#4b5ef8",
    colorBg: "rgba(75,94,248,0.15)",
  },
  {
    type: "submit",
    text: "Assignment Submitted",
    student: "Try Limhai",
    file: "15_TRY_LIMHAI_WEB_SR_001.zip",
    datetime: "12th May 2026, 11:00 PM",
    color: "#22d3a0",
    colorBg: "rgba(34,211,160,0.15)",
  },
];

const COLS = 3;
const totalPages = 5;

export default function StudentworkDetail() {
  const [page, setPage] = useState(5);

  const cols = Array.from({ length: COLS }, (_, ci) =>
    students.filter((_, i) => i % COLS === ci),
  );

  return (
    <div className={styles.layout}>
      {/* Left: Submitted Work Panel */}
      <div className={styles.mainPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderLeft}>
            <h2 className={styles.panelTitle}>Submitted Work</h2>
            <span className={styles.statBadge}>
              <span className={styles.statNum}>12</span> Handed In
            </span>
            <span className={styles.statBadgeMuted}>
              <span className={styles.statNum}>20</span> Assigned
            </span>
          </div>
        </div>

        <div className={styles.studentGrid}>
          {cols.map((col, ci) => (
            <div key={ci} className={styles.studentCol}>
              {col.map((s, i) => (
                <div key={i} className={styles.studentCard}>
                  {/* Top row: avatar+name on left, "Handed In" on right */}
                  <div className={styles.studentCardTop}>
                    <div className={styles.studentCardTopLeft}>
                      <Avatar name={s.name} />
                      <div className={styles.studentCardInfo}>
                        <span className={styles.studentName}>{s.name}</span>
                      </div>
                    </div>
                    <span className={styles.handedIn}>Handed In</span>
                  </div>

                  <div className={styles.fileName}>{s.file}</div>

                  <div className={styles.fileMeta}>
                    <span className={styles.fileMetaItem}>
                      <CalendarIcon />
                      {s.date}
                    </span>
                    <span className={styles.fileMetaItem}>
                      <ClockIcon />
                      {s.time}
                    </span>
                    {s.size && (
                      <span className={styles.fileMetaItem}>
                        <FileIcon />
                        {s.size}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.panelFooter}>
          <select className={styles.select}>
            <option>All Classes</option>
            <option>Class A</option>
            <option>Class B</option>
          </select>

          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`${styles.pageNum} ${page === n ? styles.pageNumActive : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Activity Log */}
      <div className={styles.activityPanel}>
        <h2 className={styles.activityTitle}>Activity Log</h2>
        <div className={styles.activityDivider} />
        <div className={styles.activityList}>
          {activityLog.map((log, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.activityIconWrap}>
                <div
                  className={styles.activityIcon}
                  style={{ background: log.colorBg, color: log.color }}
                >
                  {log.type === "submit" ? (
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                    </svg>
                  )}
                </div>
                {i < activityLog.length - 1 && (
                  <div className={styles.activityLine} />
                )}
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>
                  {log.student && <strong>{log.student} </strong>}
                  {log.text}
                </p>
                <p className={styles.activityFile}>{log.file}</p>
                <p className={styles.activityTime}>{log.datetime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
