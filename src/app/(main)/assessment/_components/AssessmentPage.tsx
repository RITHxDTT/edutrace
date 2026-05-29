"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Instruction from "../[id]/_components/Instruction/Instruction";
import Studentwork from "../[id]/_components/StudentWork/StudentWork";
import SubmitAssignment from "../[id]/_components/SubmitAssignment/SubmitAssignment";
import AssessmentFilter from "./AssessmentFilter";
import AssessmentGrid from "./AssessmentGrid";
import AssessmentHeader from "./AssessmentHeader";
import CreateTaskModal, {
  AttachmentItem,
  GradingRubricItem,
} from "../_components/CreateTaskModal";
import EditTaskModal from "../_components/EditTaskModal";
import RoomPage from "../communication/[id]/page";
import NavbarTitle from "@/components/Topbar/NavbarTitle";
import Breadcrumb from "../[id]/_components/BreadcrumbComponent";

import styles from "../[id]/_components/Instruction/Instruction.module.css";

import { Assessment } from "../types";
import { STORAGE_KEY, DEFAULT_ASSESSMENTS } from "../mockData";
import { useRole } from "../hook/useRole";

import { Calendar, User } from "iconsax-react";
import { BookOpen, MoreVertical } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  "All Status",
  "Not Yet",
  "In Progress",
  "Closed",
  "Archived",
] as const;

type Tab = "instruction" | "communication" | "submitassignment" | "studentwork";

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadAssessments(): Assessment[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Assessment[];
  } catch {}
  return DEFAULT_ASSESSMENTS;
}

function saveAssessments(assessments: Assessment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  } catch {}
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface AssessmentPageProps {
  isStudent: boolean;
}

export default function AssessmentPage({ isStudent }: AssessmentPageProps) {
  const { id } = useParams<{ id?: string }>();

  // ── List state ──
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);

  // ── Detail state ──
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("instruction");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // ── Load list ──
  useEffect(() => {
    setAssessments(loadAssessments());
  }, []);

  useEffect(() => {
    if (assessments !== null) saveAssessments(assessments);
  }, [assessments]);

  // ── Load detail when id is present ──
  useEffect(() => {
    if (!id) return;
    setLoading(true);
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
      console.error("Error loading assessment:", error);
      const found = DEFAULT_ASSESSMENTS.find(
        (item) => item.id.toString() === id,
      );
      setAssessment(found || null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ── Create handler — matches CreateTaskModal's onCreate signature exactly ──
  const handleCreate = (data: {
    title: string;
    acceptLate: boolean;
    description: string;
    assessmentDate: string;
    startDate: string;
    endDate: string;
    daysUntilDeadline: number;
    requiredDailyMinutes: number;
    points: number;
    category: string;
    classes: string[];
    gradingRubric: GradingRubricItem[];
    passingScore: number;
    attachments: AttachmentItem[];
    status: "Not Yet";
  }) => {
    const newAssessment: Assessment = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      assignedBy: "Tan Dara",
      points: data.points,
      requiredDailyMinutes: data.requiredDailyMinutes,
    };
    setAssessments((prev) => [newAssessment, ...(prev ?? [])]);
    setIsModalOpen(false);
  };

  // ── Detail handlers ──
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

  // ── Save handler — matches EditTaskModal's onSave signature exactly ──
  const handleSaveEdit = (data: {
    title: string;
    acceptLate: boolean;
    description: string;
    assessmentDate: string;
    startDate: string;
    endDate: string;
    daysUntilDeadline: number;
    requiredDailyMinutes: number;
    points: number;
    category: string;
    classes: string[];
    gradingRubric: GradingRubricItem[];
    attachments: AttachmentItem[];
  }) => {
    if (!assessment) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    let list: Assessment[] = DEFAULT_ASSESSMENTS;
    if (saved) list = JSON.parse(saved);
    const updatedAssessment: Assessment = {
      ...assessment,
      title: data.title,
      description: data.description,
      category: data.category,
      startDate: data.startDate,
      endDate: data.endDate,
      points: data.points,
      requiredDailyMinutes: data.requiredDailyMinutes,
    };
    const updatedList = list.map((item) =>
      item.id === assessment.id ? updatedAssessment : item,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    setAssessment(updatedAssessment);
    setEditOpen(false);
  };

  // ── Filtered list ──
  const filtered =
    assessments === null
      ? []
      : statusFilter === "All Status"
        ? assessments
        : assessments.filter((a) => a.status === statusFilter);

  // ════════════════════════════════════════════════════════════
  // DETAIL VIEW
  // ════════════════════════════════════════════════════════════
  if (id) {
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
        <NavbarTitle title="Assessment" override />
        <Breadcrumb props={{ title: assessment.title, href: id }} />

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
                  <BookOpen size={20} color="#6B7280" />
                  Subject:<strong> {assessment.category}</strong>
                </span>
                <div className={styles.metaDivider} />
                <span className={styles.metaDate}>
                  <User size={20} color="#6B7280" />
                  Assigned By:<strong> {assessment.assignedBy}</strong>
                </span>
                <div className={styles.metaDivider} />
                <span className={styles.metaDate}>
                  <Calendar size={20} color="#6B7280" />
                  Start:<strong> {assessment.startDate}</strong>
                </span>
                <div className={styles.metaDivider} />
                <span className={styles.metaDate}>
                  <Calendar size={20} color="#6B7280" />
                  Due:<strong> {assessment.endDate}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.pointsBadge}>{assessment.points} Points</div>
            {!isStudent && (
              <div className={styles.menuWrapper}>
                <button
                  className={styles.menuButton}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <MoreVertical size={20} color="black" />
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
                    <button
                      className={styles.menuItem}
                      onClick={handleCopyLink}
                    >
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

        {/* TAB CONTENT */}
        {activeTab === "instruction" && <Instruction assessment={assessment} />}
        {activeTab === "communication" && <RoomPage />}
        {activeTab === "submitassignment" && <SubmitAssignment />}
        {activeTab === "studentwork" && <Studentwork isStudent={isStudent} />}

        {/* EDIT MODAL */}
        {!isStudent && editOpen && (
          <EditTaskModal
            assessment={assessment}
            onClose={() => setEditOpen(false)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════════════════════
  return (
    <>
      <NavbarTitle title="Assessment" override />
      <div className="flex-1 min-h-0 px-8 pt-7 pb-10 overflow-visible">
        <AssessmentHeader
          title="Assessment"
          description="Manage assessments, deadlines, and progress"
          buttonText={!isStudent ? "Create Assessment" : undefined}
          onClick={!isStudent ? () => setIsModalOpen(true) : undefined}
        />

        <div className="relative z-50">
          <AssessmentFilter
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="relative z-0">
          {assessments === null ? (
            <div className="text-sm text-gray-400 pt-10 text-center">
              Loading...
            </div>
          ) : (
            <AssessmentGrid assessments={filtered} />
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {!isStudent && isModalOpen && (
        <CreateTaskModal
          onClose={() => setIsModalOpen(false)}
          onBack={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
