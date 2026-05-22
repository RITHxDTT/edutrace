"use client";

import styles from "../instruction.module.css";

const requirements = [
  "HTML, CSS, and JavaScript implementation",
  "Responsive layout",
  "Cross-browser compatibility",
  "Interactive buttons, forms, menus, or sliders",
  "Clean and reusable code",
  "Accessibility-friendly design",
  "Pixel-accurate design conversion",
  "Optimized images and assets",
];

const attachments = [
  {
    name: "Project Requirements",
    type: "DOCX",
    size: "1.2 MB",
    action: "Download",
    icon: "doc",
    color: "#5b52e8",
    colorBg: "#eff0fe",
  },
  {
    name: "Project Setup Guidelines",
    type: "YouTube Link",
    size: null,
    action: "Open",
    icon: "play",
    color: "#ef4444",
    colorBg: "#fef2f2",
  },
  {
    name: "prerequisite-web-001",
    type: "ZIP",
    size: "5.2 MB",
    action: "Download",
    icon: "zip",
    color: "#f59e0b",
    colorBg: "#fef9ee",
  },
];

const rubricItems = [
  { label: "Code Quality", pts: 30, color: "#6b5ef8" },
  { label: "Responsiveness", pts: 25, color: "#22d3a0" },
  { label: "Design Accuracy", pts: 25, color: "#f5a623" },
  { label: "Documentation", pts: 20, color: "#f56565" },
];

function DocIcon() {
  return (
    <svg
      width="20"
      height="20"
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

function PlayIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ZipIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  );
}

function DownloadIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

function ExternalIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

function ClockIcon({ size = 18 }: { size?: number }) {
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

function getAttachmentIcon(icon: string) {
  if (icon === "play") return <PlayIcon />;
  if (icon === "zip") return <ZipIcon />;
  return <DocIcon />;
}

export default function AssessmentDetail() {
  const totalPts = rubricItems.reduce((a, b) => a + b.pts, 0);

  return (
    <div className={styles.grid}>
      {/* Task Description */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div
            className={styles.cardIconWrap}
            style={{ color: "#6b5ef8", background: "rgba(107,94,248,0.12)" }}
          >
            <DocIcon />
          </div>
          <h2 className={styles.cardTitle}>Task Description</h2>
        </div>
        <div className={styles.divider} />
        <p className={styles.taskDesc}>
          Develop a responsive and user-friendly website that works smoothly
          across desktop, tablet, and mobile devices. The task includes
          designing the layout, building core pages, adding, optimizing
          performance, and ensuring the site is easy to update and maintain.
        </p>
        <p className={styles.reqLabel}>REQUIREMENTS</p>
        <ul className={styles.reqList}>
          {requirements.map((r) => (
            <li key={r} className={styles.reqItem}>
              <span className={styles.reqDot} />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Attachments */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div
            className={styles.cardIconWrap}
            style={{ color: "#22d3a0", background: "rgba(34,211,160,0.12)" }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </div>
          <div>
            <h2 className={styles.cardTitle}>Attachments</h2>
            <p className={styles.attachCount}>3 files</p>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.attachList}>
          {attachments.map((a, i) => (
            <div key={i} className={styles.attachRow}>
              <div
                className={styles.attachIcon}
                style={{ color: a.color, background: a.colorBg }}
              >
                {getAttachmentIcon(a.icon)}
              </div>
              <div className={styles.attachInfo}>
                <p className={styles.attachName}>{a.name}</p>
                <p className={styles.attachMeta}>
                  {a.type}
                  {a.size ? `  ·  ${a.size}` : ""}
                </p>
              </div>
              <button className={styles.attachAction}>
                {a.action === "Download" ? <DownloadIcon /> : <ExternalIcon />}
                {a.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Grading Rubric */}
      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <div className={styles.cardHeader}>
            <div
              className={styles.cardIconWrap}
              style={{ color: "#6b5ef8", background: "rgba(107,94,248,0.12)" }}
            >
              <DocIcon />
            </div>
            <h2 className={styles.cardTitle}>Grading Rubric</h2>
          </div>
          <div className={styles.totalPts}>
            Total Points{" "}
            <span className={styles.totalPtsVal}>{totalPts} pts</span>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.rubricGrid}>
          {rubricItems.map((item) => (
            <div key={item.label} className={styles.rubricItem}>
              <span className={styles.rubricLabel}>{item.label}</span>
              <span className={styles.rubricPts} style={{ color: item.color }}>
                {item.pts} pts
              </span>
            </div>
          ))}
        </div>
        <div className={styles.rubricBar}>
          {rubricItems.map((item) => (
            <div
              key={item.label}
              className={styles.rubricBarSegment}
              style={{ flex: item.pts, background: item.color }}
              title={`${item.label}: ${item.pts} pts`}
            />
          ))}
        </div>
        <div className={styles.rubricFooter}>
          <span className={styles.rubricFooterLeft}>
            {rubricItems.length} criteria total
          </span>
          <span className={styles.rubricFooterRight}>
            Passing score: <strong>60 pts (60%)</strong>
          </span>
        </div>
      </div>

      {/* Assessment Time */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div
            className={styles.cardIconWrap}
            style={{ color: "#f5a623", background: "rgba(245,166,35,0.12)" }}
          >
            <ClockIcon />
          </div>
          <h2 className={styles.cardTitle}>Assessment Time</h2>
        </div>
        <div className={styles.divider} />
        <div className={styles.timeGrid}>
          <div className={styles.timeCard}>
            <div className={styles.timeCardIcon}>
              <ClockIcon size={22} />
            </div>
            <div>
              <p className={styles.timeCardLabel}>Required Daily (minutes)</p>
              <p className={styles.timeCardValue}>
                60 <span className={styles.timeCardUnit}>min</span>
              </p>
            </div>
          </div>
          <div className={styles.timeCard}>
            <div className={styles.timeCardIcon}>
              <ClockIcon size={22} />
            </div>
            <div>
              <p className={styles.timeCardLabel}>Days until deadline</p>
              <p className={styles.timeCardValue}>
                2 <span className={styles.timeCardUnit}>days</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
