"use client";

import { useState } from "react";
import styles from "./_components/Instruction/Instruction.module.css";
import Instruction from "./_components/Instruction/Instruction";
import Studentwork from "./_components/StudentWork/StudentWork";

type Tab = "instruction" | "communication" | "studentwork";

function DocIcon() {
  return (
    <svg
      width="24"
      height="24"
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

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function BookIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

export default function AssessmentIdPage() {
  const [activeTab, setActiveTab] = useState<Tab>("instruction");

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <DocIcon />
          </div>
          <div>
            <h1 className={styles.title}>Web Development</h1>
            <div className={styles.meta}>
              <span className={styles.metaDate}>
                <BookIcon />
                Subject: <strong>Web</strong>
              </span>
              <div className={styles.metaDivider} />
              <span className={styles.metaDate}>
                <UserIcon />
                Assigned By: <strong>Tan Dara</strong>
              </span>
              <div className={styles.metaDivider} />
              <span className={styles.metaDate}>
                <CalendarIcon />
                Start: <strong>09th May 2026</strong>
              </span>
              <div className={styles.metaDivider} />
              <span className={styles.metaDate}>
                <CalendarIcon />
                Due: <strong>13th May 2026</strong>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.pointsBadge}>100 Points</div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabs}>
        {(
          [
            { key: "instruction", label: "Instruction" },
            { key: "communication", label: "Communication Room" },
            { key: "studentwork", label: "Student Work" },
          ] as { key: Tab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "instruction" && <Instruction/>}
      {activeTab === "communication" && (
        <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
          Communication Room — coming soon
        </div>
      )}
      {activeTab === "studentwork" && <Studentwork/>}
    </div>
  );
}
