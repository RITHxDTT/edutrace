"use client";

import { useState } from "react";
import styles from "./StudentWork.module.css";
import FolderCard from "./Foldercard";
import { ChevronDownIcon } from "lucide-react";

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

const students = [
  {
    name: "Chhorn Chamreun",
    file: "16_CHHORN_CHAMREUN_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "42 MB",
    status: "Handed In",
    folderIcon: "/images/icon/folder.png",
  },
  {
    name: "Keo Vuthana",
    file: "09_KEO_VUTHANA_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "12 MB",
    status: "Handed In",
    folderIcon: "/images/icon/link.png",
  },
  {
    name: "Chea Penghoung",
    file: "02_CHEA_PENGHOUNG_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "30 MB",
    status: "Pending",
    folderIcon: "/images/icon/folder.png",
  },
  {
    name: "Uy Chakriya",
    file: "18_UY_CHAKRIYA_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "18 MB",
    status: "Late",
    folderIcon: "/images/icon/link.png",
  },
  {
    name: "Yann Vanneth",
    file: "12_YANN_VANNETH_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "25 MB",
    status: "Handed In",
    folderIcon: "/images/icon/folder.png",
  },
  {
    name: "Chhor Vichey",
    file: "14_CHHOR_VICHEY_ASSIGNMENT.pdf",
    date: "13 May 2026",
    time: "11:00 PM",
    size: "15 MB",
    status: "Handed In",
    folderIcon: "/images/icon/link.png",
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
    type: "score",
    text: "Score Given",
    student: "Uy Chakriya",
    file: "Instructor gave score: 95/100",
    datetime: "12th May 2026, 10:30 PM",
    color: "#4b5ef8",
    colorBg: "rgba(75,94,248,0.15)",
  },
  {
    type: "comment",
    text: "Comment Added",
    student: "Keo Vuthana",
    file: "Please improve responsive section design",
    datetime: "12th May 2026, 09:15 PM",
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.15)",
  },
  {
    type: "submit",
    text: "Assignment Resubmitted",
    student: "Chea Penghoung",
    file: "02_CHEA_PENGHOUNG_ASSIGNMENT_V2.pdf",
    datetime: "11th May 2026, 08:45 PM",
    color: "#22d3a0",
    colorBg: "rgba(34,211,160,0.15)",
  },
  {
    type: "late",
    text: "Late Submission",
    student: "Uy Chakriya",
    file: "Submitted after deadline",
    datetime: "11th May 2026, 07:20 PM",
    color: "#ef4444",
    colorBg: "rgba(239,68,68,0.15)",
  },
  {
    type: "download",
    text: "File Downloaded",
    student: "Instructor",
    file: "12_YANN_VANNETH_ASSIGNMENT.pdf",
    datetime: "11th May 2026, 06:10 PM",
    color: "#06b6d4",
    colorBg: "rgba(6,182,212,0.15)",
  },
  {
    type: "submit",
    text: "Assignment Submitted",
    student: "Yann Vanneth",
    file: "12_YANN_VANNETH_ASSIGNMENT.pdf",
    datetime: "10th May 2026, 11:40 PM",
    color: "#22d3a0",
    colorBg: "rgba(34,211,160,0.15)",
  },
  {
    type: "comment",
    text: "Private Feedback Sent",
    student: "Chhorn Chamreun",
    file: "Excellent UI implementation",
    datetime: "10th May 2026, 10:05 PM",
    color: "#8b5cf6",
    colorBg: "rgba(139,92,246,0.15)",
  },
];

const totalPages = 5;

export default function Studentwork() {
  const [page, setPage] = useState(1);

  return (
    <div className={styles.layout}>
      {/* LEFT PANEL */}
      <div className={styles.mainPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderLeft}>
            <h2 className={styles.panelTitle}>Submitted Work</h2>
            <span className={styles.statBadge}>
              <span className={styles.statNum}>12</span>
              Handed In
            </span>
            <span className={styles.statBadgeMuted}>
              <span className={styles.statNum}>20</span>
              Assigned
            </span>
          </div>
        </div>

        {/* GRID */}
        <div className={styles.folderGrid}>
          {students.map((student, index) => (
            <FolderCard
              key={index}
              studentName={student.name}
              status={student.status as "Handed In" | "Pending" | "Late"}
              fileName={student.file}
              date={student.date}
              time={student.time}
              fileSize={student.size}
              folderIconUrl={student.folderIcon}
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className={styles.panelFooter}>
          <div className={styles.selectWrapper}>
            <select className={styles.select}>
              <option>All Classes</option>
              <option>Class A</option>
              <option>Class B</option>
            </select>
            <ChevronDownIcon className={styles.icon} aria-hidden="true" />
          </div>
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`${styles.pageNum} ${
                  page === n ? styles.pageNumActive : ""
                }`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}

            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={styles.activityPanel}>
        <h2 className={styles.activityTitle}>Activity Log</h2>

        <div className={styles.activityDivider} />

        <div className={styles.activityList}>
          {activityLog.map((log, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.activityIconWrap}>
                <div
                  className={styles.activityIcon}
                  style={{
                    background: log.colorBg,
                    color: log.color,
                  }}
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
                  ) : log.type === "score" ? (
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
                  ) : log.type === "comment" ? (
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h8M8 14h5m-9 6l2-3h11a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h1l2 3z"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3"
                      />
                      <circle cx="12" cy="12" r="9" />
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
