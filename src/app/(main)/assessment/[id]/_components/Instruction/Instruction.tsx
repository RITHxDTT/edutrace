"use client";

import { DEFAULT_ASSESSMENTS } from "../../../mockData";
import { Assessment } from "../../../types";
import styles from "./Instruction.module.css";

interface Props {
  assessment?: Assessment | null;
}

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

function PdfIcon() {
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
        d="M7 3h7l5 5v13a1 1 0 01-1 1H7a2 2 0 01-2-2V5a2 2 0 012-2z"
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

function getAttachmentIcon(type: string) {
  switch (type) {
    case "youtube":
      return <PlayIcon />;

    case "zip":
      return <ZipIcon />;

    case "pdf":
      return <PdfIcon />;

    default:
      return <DocIcon />;
  }
}

function getAttachmentColor(type: string) {
  switch (type) {
    case "youtube":
      return {
        color: "#ef4444",
        background: "#fef2f2",
      };

    case "zip":
      return {
        color: "#f59e0b",
        background: "#fef9ee",
      };

    case "pdf":
      return {
        color: "#dc2626",
        background: "#fef2f2",
      };

    default:
      return {
        color: "#5b52e8",
        background: "#eff0fe",
      };
  }
}

export default function Instruction({ assessment }: Props) {
  //   FIX: use assessment if it exists (any truthy object), fallback only if null/undefined
  const data = assessment ?? DEFAULT_ASSESSMENTS[0];

  const totalPts =
    data.gradingRubric?.reduce((acc, item) => acc + item.points, 0) || 0;

  return (
    <div className={styles.grid}>
      {/* Task Description */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div
            className={styles.cardIconWrap}
            style={{
              color: "#6b5ef8",
              background: "rgba(107,94,248,0.12)",
            }}
          >
            <DocIcon />
          </div>

          <h2 className={styles.cardTitle}>Task Description</h2>
        </div>

        <div className={styles.divider} />

        <p className={styles.taskDesc}>{data.description}</p>

        <p className={styles.reqLabel}>REQUIREMENTS</p>

        <ul className={styles.reqList}>
          {data.requirements?.map((requirement) => (
            <li key={requirement} className={styles.reqItem}>
              <span className={styles.reqDot} />
              {requirement}
            </li>
          ))}
        </ul>
      </div>

      {/* Attachments */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div
            className={styles.cardIconWrap}
            style={{
              color: "#22d3a0",
              background: "rgba(34,211,160,0.12)",
            }}
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

            <p className={styles.attachCount}>
              {data.attachments?.length || 0} files
            </p>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.attachList}>
          {data.attachments?.map((attachment) => {
            const attachmentStyle = getAttachmentColor(attachment.type);

            return (
              <div key={attachment.id} className={styles.attachRow}>
                <div
                  className={styles.attachIcon}
                  style={{
                    color: attachmentStyle.color,
                    background: attachmentStyle.background,
                  }}
                >
                  {getAttachmentIcon(attachment.type)}
                </div>

                <div className={styles.attachInfo}>
                  <p className={styles.attachName}>{attachment.name}</p>

                  <p className={styles.attachMeta}>
                    {attachment.type.toUpperCase()}
                    {attachment.size ? ` · ${attachment.size}` : ""}
                  </p>
                </div>

                <a
                  href={attachment.url}
                  target="_blank"
                  className={styles.attachAction}
                >
                  {attachment.action === "Download" ? (
                    <DownloadIcon />
                  ) : (
                    <ExternalIcon />
                  )}

                  {attachment.action}
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grading Rubric */}
      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <div className={styles.cardHeader}>
            <div
              className={styles.cardIconWrap}
              style={{
                color: "#6b5ef8",
                background: "rgba(107,94,248,0.12)",
              }}
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
          {data.gradingRubric?.map((item) => (
            <div key={item.label} className={styles.rubricItem}>
              <span className={styles.rubricLabel}>{item.label}</span>

              <span className={styles.rubricPts} style={{ color: "#6b5ef8" }}>
                {item.points} pts
              </span>
            </div>
          ))}
        </div>

        <div className={styles.rubricBar}>
          {data.gradingRubric?.map((item) => (
            <div
              key={item.label}
              className={styles.rubricBarSegment}
              style={{
                flex: item.points,
                background: "#6b5ef8",
              }}
            />
          ))}
        </div>

        <div className={styles.rubricFooter}>
          <span className={styles.rubricFooterLeft}>
            {data.gradingRubric?.length || 0} criteria total
          </span>

          <span className={styles.rubricFooterRight}>
            Passing score:
            <strong>
              {" "}
              {data.passingScore} pts ({data.passingScore}%)
            </strong>
          </span>
        </div>
      </div>

      {/* Assessment Time */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div
            className={styles.cardIconWrap}
            style={{
              color: "#2E25C9",
              background: "#EEEFFF",
            }}
          >
            <ClockIcon /> {/* just the SVG, no wrapper */}
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
                {data.requiredDailyMinutes}
                <span className={styles.timeCardUnit}> min</span>
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
                {data.daysUntilDeadline}
                <span className={styles.timeCardUnit}> days</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
