"use client";

import { useState } from "react";

import styles from "./AssessmentDetail.module.css";

import Instruction from "../Instruction/Instruction";
import StudentWork from "../StudentWork/StudentWork";
import Communication from "../Communication/Communication";

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

export default function AssessmentDetail() {
  const [activeTab, setActiveTab] = useState<Tab>("instruction");

  const tabs: { key: Tab; label: string }[] = [
    { key: "instruction", label: "Instruction" },
    { key: "communication", label: "Communication Room" },
    { key: "studentwork", label: "Student Work" },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <DocIcon />
          </div>

          <div>
            <h1 className={styles.title}>Web Development</h1>
          </div>
        </div>

        <div className={styles.pointsBadge}>100 Points</div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${
              activeTab === tab.key ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === "instruction" && <Instruction />}
        {activeTab === "communication" && <Communication />}
        {activeTab === "studentwork" && <StudentWork />}
      </div>
    </div>
  );
}
