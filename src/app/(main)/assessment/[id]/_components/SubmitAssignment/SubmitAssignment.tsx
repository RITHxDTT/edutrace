"use client";

import { useRef, useState } from "react";
import { MOCK_SUBMITTED_FILES, TEST_EVALUATION } from "./mockData";
import type { EvaluationResult } from "./types";

// ── Icons ─────────────────────────────────────────────────────────────────────

function UploadIcon() {
  return (
    <svg
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#6b5ef8"
      strokeWidth={1.6}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#f59e0b"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#d97706"
      strokeWidth={1.8}
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#6b5ef8"
      strokeWidth={1.6}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#6b5ef8"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="16" height="16" fill="#5b52e8" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExt(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface SubmitAssignmentProps {
  onSubmit?: (files: File[]) => void;
  onUnsubmit?: () => void;
  evaluation?: EvaluationResult | null;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SubmitAssignment({
  onSubmit,
  onUnsubmit,
  evaluation = TEST_EVALUATION,
}: SubmitAssignmentProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEvaluated = evaluation !== null;

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles((prev) => [...prev, ...Array.from(incoming)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = () => {
    if (files.length === 0) return;
    onSubmit?.(files);
  };

  // ── File list source ───────────────────────────────────────────────────────
  const evaluationFiles = evaluation?.files ?? [];
  const showEvaluationFiles = isEvaluated && evaluationFiles.length > 0;

  // When not evaluated, show MOCK_SUBMITTED_FILES as already-submitted files
  const submittedFiles = !isEvaluated ? MOCK_SUBMITTED_FILES : [];
  const showSubmittedFiles = submittedFiles.length > 0;
  const showLocalFiles = files.length > 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: 18,
        padding: "0 32px 32px",
        alignItems: "start",
      }}
    >
      {/* ── LEFT — Submit form ────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #e8eaf2",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(80,80,140,0.06)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Card header */}
        <div
          style={{
            padding: "22px 24px 18px",
            borderBottom: "1px solid #f0f1f8",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#eeedf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#6b5ef8"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
              Submit Assignment
            </h2>
            <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
              Upload your work and add a note for your instructor
            </p>
          </div>
        </div>

        <div style={{ padding: "22px 24px", flex: 1 }}>
          {/* ── File list (shown above drop zone) ─────────────────────────── */}
          {(showEvaluationFiles || showSubmittedFiles || showLocalFiles) && (
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: 12,
                }}
              >
                Uploaded Files (
                {showEvaluationFiles
                  ? evaluationFiles.length
                  : showSubmittedFiles
                    ? submittedFiles.length + files.length
                    : files.length}
                )
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {/* Evaluated — read-only files */}
                {showEvaluationFiles &&
                  evaluationFiles.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        border: "1px solid #ececf5",
                        borderRadius: 14,
                        padding: "14px 18px",
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: "#fff8ec",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FolderIcon />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#111827",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            marginTop: 3,
                          }}
                        >
                          {file.type}&nbsp;&nbsp;{file.size}
                        </p>
                      </div>
                    </div>
                  ))}

                {/* Pending — already submitted files (read-only, no remove) */}
                {showSubmittedFiles &&
                  submittedFiles.map((file, i) => (
                    <div
                      key={`submitted-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        border: "1px solid #ececf5",
                        borderRadius: 14,
                        padding: "14px 18px",
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: "#fff8ec",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FolderIcon />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#111827",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            marginTop: 3,
                          }}
                        >
                          {file.type}&nbsp;&nbsp;{file.size}
                        </p>
                      </div>
                    </div>
                  ))}

                {/* Newly added local files (removable) */}
                {showLocalFiles &&
                  files.map((file, i) => (
                    <div
                      key={`local-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        border: "1px solid #ececf5",
                        borderRadius: 14,
                        padding: "14px 18px",
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: "#fff8ec",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FolderIcon />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#111827",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            marginTop: 3,
                          }}
                        >
                          {getExt(file.name)}&nbsp;&nbsp;
                          {formatBytes(file.size)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#9ca3af",
                          padding: 6,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <XIcon />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isEvaluated && fileInputRef.current?.click()}
            style={{
              border: `1.5px dashed ${dragging ? "#6b5ef8" : "#d1d5f0"}`,
              borderRadius: 16,
              padding: "48px 24px",
              textAlign: "center",
              cursor: isEvaluated ? "default" : "pointer",
              background: dragging ? "rgba(107,94,248,0.04)" : "#fafafe",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => addFiles(e.target.files)}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#eeedf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UploadIcon />
              </div>
            </div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 6,
              }}
            >
              Drag &amp; drop your file here or{" "}
              <span style={{ color: "#5b52e8" }}>browse</span>
            </p>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>
              You can upload multiple files
            </p>
            <p style={{ fontSize: 12, color: "#b0b4c4" }}>
              Accepted formats: PDF, DOCX, ZIP, PNG, JPG, GIF, MP4, Link
            </p>
          </div>
        </div>

        {/* ── Submit / Unsubmit button ───────────────────────────────────────── */}
        <div style={{ padding: "0 24px 24px" }}>
          {isEvaluated ? (
            <button
              onClick={onUnsubmit}
              style={{
                width: "100%",
                height: 54,
                borderRadius: 14,
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Unsubmit
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={files.length === 0}
              style={{
                width: "100%",
                height: 54,
                borderRadius: 14,
                background: files.length === 0 ? "#c4c2f0" : "#4f46e5",
                color: "#fff",
                border: "none",
                fontSize: 16,
                fontWeight: 700,
                cursor: files.length === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontFamily: "inherit",
              }}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 0l-3 3m3-3l3 3"
                />
              </svg>
              Submit
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT — Evaluation result panel ──────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
          Evaluation Result
        </h2>

        {isEvaluated && evaluation ? (
          <>
            {/* Score card */}
            <div
              style={{
                border: "1.5px solid #86efac",
                borderRadius: 16,
                padding: "20px 22px",
                background: "#f0fdf4",
              }}
            >
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#15803d",
                  marginBottom: 6,
                }}
              >
                {evaluation.score}
                <span
                  style={{ fontSize: 16, fontWeight: 500, color: "#4ade80" }}
                >
                  {" "}
                  / {evaluation.total}
                </span>
              </p>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#16a34a",
                  marginBottom: 2,
                }}
              >
                {evaluation.comment}
              </p>
              <p style={{ fontSize: 12, color: "#86efac" }}>
                Evaluated on {evaluation.evaluatedAt}
              </p>
            </div>

            {/* Instructor feedback */}
            <div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 14,
                }}
              >
                Instructor Feedback
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                {evaluation.instructor.avatar ? (
                  <img
                    src={evaluation.instructor.avatar}
                    alt={evaluation.instructor.name}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #e8eaf2",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#1d4ed8",
                    }}
                  >
                    {evaluation.instructor.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p
                    style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}
                  >
                    {evaluation.instructor.name}
                  </p>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      background: "#e8eaf2",
                      color: "#5b52e8",
                      padding: "2px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {evaluation.instructor.role}
                  </span>
                </div>
              </div>
              <div
                style={{
                  background: "#eeedf8",
                  borderRadius: 14,
                  padding: "16px 18px",
                  border: "1px solid #d8d6f5",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <QuoteIcon />
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5" }}
                  >
                    Written Feedback
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
                  {evaluation.feedback}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Pending Review card */}
            <div
              style={{
                border: "1.5px solid #fcd34d",
                borderRadius: 16,
                padding: "16px 20px",
                background: "#fffbeb",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ClockIcon />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#3E3E3E" }}>
                  Pending Review
                </p>
                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                  Not evaluated yet
                </p>
              </div>
            </div>

            {/* Feedback placeholder */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #e8eaf2",
                padding: "32px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
                minHeight: 404,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#eeedf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChatIcon />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 6,
                  }}
                >
                  Teacher feedback will appear here
                  <br />
                  after evaluation.
                </p>
                <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>
                  We appreciate your patience while
                  <br />
                  your instructor reviews your work.
                </p>
              </div>
            </div>

            {/* Notification notice */}
            <div
              style={{
                background: "#EEEFFF",
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: "1.5px solid #5B5EDD",
              }}
            >
              <BellIcon />
              <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
                You will be notified when your assignment is evaluated by your
                instructor
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
