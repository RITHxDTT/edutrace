"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Instruction from "./Instruction/Instruction";
import Studentwork from "./StudentWork/StudentWork";
import EditTaskModal from "../../_components/EditTaskModal";
import SubmitAssignment from "./SubmitAssignment/SubmitAssignment";

import styles from "./Instruction/Instruction.module.css";

import { Assessment } from "../../types";
import { STORAGE_KEY, DEFAULT_ASSESSMENTS } from "../../mockData";
import { Calendar, Note} from "iconsax-react";
import { BookOpen, User} from "lucide-react";

type Tab = "instruction" | "communication" | "submitassignment" | "studentwork";

interface AssessmentDetailPageProps {
  isStudent: boolean;
}

export default function AssessmentDetailPage({
  isStudent,
}: AssessmentDetailPageProps) {
  const { id } = useParams<{ id: string }>();

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
            <Note size={20} color="white" />
          </div>
          <div>
            <h1 className={styles.title}>{assessment.title}</h1>
            <div className={styles.meta}>
              <span className={styles.metaDate}>
                <BookOpen size={20} color="#000000" />
                Subject:<strong> {assessment.category}</strong>
              </span>

              <div className={styles.metaDivider} />

              <span className={styles.metaDate}>
                <User size={20} color="#000000" />
                Assigned By:<strong> {assessment.assignedBy}</strong>
              </span>

              <div className={styles.metaDivider} />

              <span className={styles.metaDate}>
                <Calendar size={20} color="#000000" />
                Start:<strong> {assessment.startDate}</strong>
              </span>

              <div className={styles.metaDivider} />

              <span className={styles.metaDate}>
                <Calendar size={20} color="#000000" />
                Due:<strong> {assessment.endDate}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.pointsBadge}>{assessment.points} Points</div>

          {/* Only teacher sees the menu */}
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

      {activeTab === "studentwork" && <Studentwork isStudent={isStudent} />}

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
