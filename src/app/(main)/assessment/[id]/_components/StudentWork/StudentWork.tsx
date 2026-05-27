"use client";

import { useState } from "react";
import { useRole } from "../../../hook/useRole";
import FolderCard from "./Foldercard";
import styles from "./StudentWork.module.css";
import {
  DAILY_REQUIRED,
  MOCK_ACTIVITY_LOG,
  MOCK_SESSION_LOG,
  MOCK_STUDENTS,
  TIME_SPENT_TODAY,
} from "./mockupData";

//          Constants        ──────────────────

const filterOptions = ["All Classes", "Class A", "Class B", "Class C"];
const totalPages = 5;

//          Icons        ──────────────────────

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

function CalSvg() {
  return (
    <svg
      width="13"
      height="13"
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

function ClockSvg({ color = "#6b5ef8" }: { color?: string }) {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth={1.8}
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function NotesSvg() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#f59e0b"
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

function InfoSvg() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#6b5ef8"
      strokeWidth={1.8}
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
    </svg>
  );
}

//          Shared Components        ──────────

function Card({
  icon,
  iconBg,
  iconColor,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #e8eaf2",
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingBottom: 14,
          borderBottom: "1px solid #f0f1f8",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: iconBg,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{ background: "#f8f8fc", borderRadius: 12, padding: "12px 14px" }}
    >
      <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{value}</p>
    </div>
  );
}

function RingChart({ spent, total }: { spent: number; total: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(spent / total, 1));
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#e8eaf2"
        strokeWidth="10"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#5b52e8"
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="47"
        textAnchor="middle"
        fontSize="16"
        fontWeight="600"
        fill="#111827"
      >
        {spent}
        <tspan fontSize="11" fill="#9ca3af">
          /{total}
        </tspan>
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="10" fill="#9ca3af">
        min · today
      </text>
    </svg>
  );
}

function SessionBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; icon: string }> = {
    Completed: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", icon: "✓" },
    Uncompleted: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", icon: "✕" },
    "In Progress": { bg: "rgba(245,158,11,0.12)", color: "#d97706", icon: "⏱" },
  };
  const s = map[status] ?? map["In Progress"];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {s.icon} {status}
    </span>
  );
}

//          Main Component        ─────────────

export default function Studentwork() {
  const { isStudent } = useRole();
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("All Classes");
  const isSubmitted = false;

  const REMAINING = DAILY_REQUIRED - TIME_SPENT_TODAY;
  const TOTAL_TIME_SPENT_MIN = MOCK_SESSION_LOG.reduce(
    (a, s) => a + s.duration,
    0,
  );
  const TOTAL_HRS = Math.floor(TOTAL_TIME_SPENT_MIN / 60);
  const TOTAL_MINS = TOTAL_TIME_SPENT_MIN % 60;

  return (
    <div className={styles.layout}>
      {isStudent ? (
        /*          STUDENT VIEW          */
        <div
          style={{
            gridColumn: "1 / -1",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            padding: "0 0 24px",
          }}
        >
          {/* Daily Time Progress */}
          <Card
            icon={<ClockSvg />}
            iconBg="#eeedf8"
            iconColor="#6b5ef8"
            title="Daily Time Progress"
          >
            {isSubmitted ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px 0",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(34,197,94,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#16a34a"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                  You have already submitted your work
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <RingChart spent={TIME_SPENT_TODAY} total={DAILY_REQUIRED} />
                <div
                  style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <StatBox
                    label="Daily Required"
                    value={`${DAILY_REQUIRED} min`}
                  />
                  <StatBox
                    label="Time Spent Today"
                    value={`${TIME_SPENT_TODAY} min`}
                  />
                  <StatBox label="Remaining" value={`${REMAINING} min`} />
                  <div
                    style={{
                      background: "#f8f8fc",
                      borderRadius: 12,
                      padding: "10px 12px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        marginBottom: 6,
                      }}
                    >
                      Current Status
                    </p>
                    <span
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        color: "#16a34a",
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      ✓ On Track
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Assessment Time Summary */}
          <Card
            icon={<ClockSvg />}
            iconBg="#eeedf8"
            iconColor="#6b5ef8"
            title="Assessment Time Summary"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <StatBox
                label="Total Time Spent"
                value={`${TOTAL_HRS}h ${TOTAL_MINS}m`}
              />
              <StatBox
                label="Sessions Completed"
                value={`${MOCK_SESSION_LOG.length}`}
              />
              <StatBox
                label="Avg Session Length"
                value={`${Math.round(TOTAL_TIME_SPENT_MIN / MOCK_SESSION_LOG.length)} min`}
              />
              <StatBox label="Days Before Deadline" value="1 Day" />
            </div>
          </Card>

          {/* Work Session Log */}
          <Card
            icon={<NotesSvg />}
            iconBg="#fff8ec"
            iconColor="#f59e0b"
            title="Work Session Log"
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {["Date", "Start Time", "End Time", "Duration", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#9ca3af",
                          paddingBottom: 10,
                          borderBottom: "1px solid #f0f1f8",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {MOCK_SESSION_LOG.map((s, i) => (
                  <tr key={s.id}>
                    <td
                      style={{
                        padding: "11px 0",
                        borderBottom:
                          i < MOCK_SESSION_LOG.length - 1
                            ? "1px solid #f8f8fc"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          color: "#6b7280",
                        }}
                      >
                        <CalSvg /> {s.date}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        borderBottom:
                          i < MOCK_SESSION_LOG.length - 1
                            ? "1px solid #f8f8fc"
                            : "none",
                        color: "#374151",
                      }}
                    >
                      {s.start}
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        borderBottom:
                          i < MOCK_SESSION_LOG.length - 1
                            ? "1px solid #f8f8fc"
                            : "none",
                        color: "#374151",
                      }}
                    >
                      {s.end}
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        borderBottom:
                          i < MOCK_SESSION_LOG.length - 1
                            ? "1px solid #f8f8fc"
                            : "none",
                        color: "#374151",
                      }}
                    >
                      {s.duration} min
                    </td>
                    <td
                      style={{
                        padding: "11px 0",
                        borderBottom:
                          i < MOCK_SESSION_LOG.length - 1
                            ? "1px solid #f8f8fc"
                            : "none",
                      }}
                    >
                      <SessionBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Assessment Overview */}
          <Card
            icon={<InfoSvg />}
            iconBg="#eeedf8"
            iconColor="#6b5ef8"
            title="Assessment Overview"
          >
            {[
              { label: "Due Date", value: "13th May 2026", type: "text" },
              {
                label: "Assessment Status",
                value: isSubmitted ? "Submitted" : "In Progress",
                type: "badge",
                submitted: isSubmitted,
              },
              {
                label: "Required Daily Minutes",
                value: "60 min",
                type: "text",
              },
              { label: "Total Score", value: "100 Points", type: "text" },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 0",
                  borderBottom:
                    i < arr.length - 1 ? "1px solid #f8f8fc" : "none",
                }}
              >
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  {row.label}
                </span>
                {row.type === "badge" ? (
                  <span
                    style={{
                      background: row.submitted
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(99,102,241,0.1)",
                      color: row.submitted ? "#16a34a" : "#4f46e5",
                      padding: "3px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {row.value}
                  </span>
                ) : (
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                  >
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </Card>
        </div>
      ) : (
        <>
          {/*          TEACHER / ADMIN VIEW          */}
          <div className={styles.mainPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelHeaderLeft}>
                <h2 className={styles.panelTitle}>Submitted Work</h2>
                <span className={styles.statDivider} />
                <span className={styles.statGroup}>
                  <span className={styles.statNum}>
                    {
                      MOCK_STUDENTS.filter((s) => s.status === "Handed In")
                        .length
                    }
                  </span>
                  <span className={styles.statLabel}>Handed In</span>
                </span>
                <span className={styles.statDivider} />
                <span className={styles.statGroup}>
                  <span className={styles.statNum}>{MOCK_STUDENTS.length}</span>
                  <span className={styles.statLabelMuted}>Assigned</span>
                </span>
              </div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                    padding: "10px 16px",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#374151",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    minWidth: 160,
                    justifyContent: "space-between",
                  }}
                >
                  {filterValue}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {filterOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: 0,
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                      zIndex: 50,
                      minWidth: "100%",
                      overflow: "hidden",
                    }}
                  >
                    {filterOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterValue(option);
                          setFilterOpen(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 16px",
                          background:
                            filterValue === option ? "#f5f4ff" : "transparent",
                          border: "none",
                          textAlign: "left",
                          fontSize: 14,
                          fontWeight: filterValue === option ? 600 : 400,
                          color: filterValue === option ? "#5b52e8" : "#374151",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            filterValue === option ? "#f5f4ff" : "#f9fafb")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            filterValue === option ? "#f5f4ff" : "transparent")
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.folderGrid}>
              {MOCK_STUDENTS.map((student) => (
                <FolderCard
                  key={student.id}
                  studentName={student.name}
                  avatarUrl={student.avatar}
                  status={student.status}
                  fileName={student.file}
                  date={student.date}
                  time={student.time}
                  fileSize={student.size}
                />
              ))}
            </div>

            <div className={styles.panelFooter}>
              {/* Custom Dropdown */}

              {/* Pagination */}
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeftIcon /> Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      className={`${styles.pageNum} ${page === n ? styles.pageNumActive : ""}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ),
                )}
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>

          {/*          ACTIVITY LOG          */}
          <div className={styles.activityPanel}>
            <h2 className={styles.activityTitle}>Activity Log</h2>
            <div className={styles.activityDivider} />
            <div className={styles.activityList}>
              {MOCK_ACTIVITY_LOG.map((log) => (
                <div key={log.id} className={styles.activityItem}>
                  <div className={styles.activityIconWrap}>
                    <div
                      className={styles.activityIcon}
                      style={{
                        background:
                          log.type === "submit"
                            ? "rgba(34,197,94,0.15)"
                            : "#1e2235",
                      }}
                    >
                      {log.type === "submit" ? (
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#16a34a"
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
                          width="14"
                          height="14"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#a5b4fc"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>
                      <strong>{log.student}</strong>
                      {log.action ? ` ${log.action}` : ""}
                    </p>
                    <p className={styles.activityFile}>{log.file}</p>
                    <p className={styles.activityTime}>{log.datetime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
