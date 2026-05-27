"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Instruction from "./_components/Instruction/Instruction";
import Studentwork from "./_components/StudentWork/StudentWork";
import EditTaskModal from "../_components/EditTaskModal";
import SubmitAssignment from "./_components/SubmitAssignment/SubmitAssignment";

import styles from "../[id]/_components/Instruction/Instruction.module.css";

import { Assessment } from "../types";
import { STORAGE_KEY, DEFAULT_ASSESSMENTS } from "../mockData";
import { useRole } from "../hook/useRole";

type Tab = "instruction" | "communication" | "submitassignment" | "studentwork";

export default function AssessmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isStudent } = useRole(); 

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("instruction");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let list: Assessment[] = DEFAULT_ASSESSMENTS;

      if (saved) {
        const parsed = JSON.parse(saved);
        list = parsed.map((item: Partial<Assessment>) => {
          const fallback = DEFAULT_ASSESSMENTS.find((a) => a.id === item.id);
          return { ...fallback, ...item } as Assessment;
        });
      }

      const found = list.find((item) => item.id.toString() === id);
      setAssessment(found || null);
    } catch (error) {
      console.error("Error loading assessments:", error);
      const found = DEFAULT_ASSESSMENTS.find(
        (item) => item.id.toString() === id,
      );
      setAssessment(found || null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleDelete = () => {
    if (!assessment) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    let list: Assessment[] = DEFAULT_ASSESSMENTS;
    if (saved) list = JSON.parse(saved);
    const updated = list.filter((item) => item.id !== assessment.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.location.href = "/assessment";
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  const handleEdit = () => {
    setEditOpen(true);
    setMenuOpen(false);
  };

  const handleSaveEdit = (updatedData: Partial<Assessment>) => {
    if (!assessment) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    let list: Assessment[] = DEFAULT_ASSESSMENTS;
    if (saved) list = JSON.parse(saved);
    const updatedList = list.map((item) =>
      item.id === assessment.id ? { ...item, ...updatedData } : item,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    setAssessment({ ...assessment, ...updatedData });
    setEditOpen(false);
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (!assessment) {
    return (
      <div
        style={{
          padding: "40px",
          fontSize: "20px",
          fontWeight: 600,
          color: "#9ca3af",
        }}
      >
        Assessment Not Found
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="8" y="2" width="8" height="3" rx="1.5" fill="white" />
              <path
                d="M6 3.5H5C3.895 3.5 3 4.395 3 5.5V20C3 21.105 3.895 22 5 22H19C20.105 22 21 21.105 21 20V5.5C21 4.395 20.105 3.5 19 3.5H18"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect
                x="8"
                y="1.5"
                width="8"
                height="4"
                rx="2"
                stroke="white"
                strokeWidth="1.8"
                fill="none"
              />
              <line
                x1="8"
                y1="11"
                x2="16"
                y2="11"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="15"
                x2="14"
                y2="15"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>{assessment.title}</h1>
            <div className={styles.meta}>
              <span className={styles.metaDate}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Subject:<strong> {assessment.category}</strong>
              </span>

              <div className={styles.metaDivider} />

              <span className={styles.metaDate}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Assigned By:<strong> {assessment.assignedBy}</strong>
              </span>

              <div className={styles.metaDivider} />

              <span className={styles.metaDate}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Start:<strong> {assessment.startDate}</strong>
              </span>

              <div className={styles.metaDivider} />

              <span className={styles.metaDate}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Due:<strong> {assessment.endDate}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.pointsBadge}>{assessment.points} Points</div>

          {/* Only teacher/ see the menu */}
          {!isStudent && (
            <div className={styles.menuWrapper}>
              <button
                className={styles.menuButton}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6h.01M12 12h.01M12 18h.01"
                  />
                </svg>
              </button>
              {menuOpen && (
                <div className={styles.dropdownMenu}>
                  <button className={styles.menuItem} onClick={handleEdit}>
                    Edit
                  </button>
                  <button
                    className={styles.menuItemDelete}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button className={styles.menuItem} onClick={handleCopyLink}>
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        {[
          { key: "instruction", label: "Instruction" },
          { key: "communication", label: "Communication Room" },
          // Submit Assignment tab only for students
          ...(isStudent
            ? [{ key: "submitassignment", label: "Submit Assignment" }]
            : []),
          { key: "studentwork", label: "Student Work" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key as Tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "instruction" && <Instruction assessment={assessment} />}

      {activeTab === "communication" && (
        <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
          Communication Room coming soon...
        </div>
      )}

      {activeTab === "submitassignment" && <SubmitAssignment />}

      {activeTab === "studentwork" && <Studentwork />}

      {/* EDIT MODAL — teacher/admin only */}
      {!isStudent && editOpen && assessment && (
        <EditTaskModal
          assessment={assessment}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
