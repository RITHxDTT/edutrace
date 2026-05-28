"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Link2,
  Pencil,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import Button from "./Button";
import InstructionEditor from "./InstructionEditor";
import Toggle from "./Toggle";

// ── Zod Schemas    ─────────

const basicInfoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters"),
  instruction: z.string().optional(),
  acceptLate: z.boolean(),
});

const detailSchema = z.object({
  startDate: z
    .date()
    .nullable()
    .refine((d) => d !== null, "Start date is required"),
  endDate: z
    .date()
    .nullable()
    .refine((d) => d !== null, "End date is required"),
  dailyRequired: z
    .string()
    .min(1, "Daily required minutes is required")
    .refine((v) => Number(v) > 0, "Must be greater than 0"),
  point: z
    .string()
    .min(1, "Point is required")
    .refine((v) => Number(v) > 0, "Must be greater than 0"),
  topic: z.string().min(1, "Please select a topic"),
  selectedClasses: z
    .array(z.string())
    .min(1, "Please assign at least one class"),
  gradingRubric: z.string().optional(),
});

type BasicInfoErrors = Partial<
  Record<keyof z.infer<typeof basicInfoSchema>, string>
>;
type DetailErrors = Partial<Record<keyof z.infer<typeof detailSchema>, string>>;

// ── Types    ───────────────

// Matches your Attachment interface exactly
export interface AttachmentItem {
  id: number;
  name: string;
  type: "docx" | "zip" | "youtube" | "pdf" | "image";
  size?: string;
  url: string;
  action: "Download" | "Open";
}

// Matches your GradingCriteria interface exactly
export interface GradingRubricItem {
  label: string;
  points: number;
}

interface EditTaskModalProps {
  assessment?: any;
  onClose: () => void;
  onSave: (data: {
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
  }) => void;
}

// ── Constants    ───────────

const TOPICS = ["Web", "Java", "UX/UI", "Flutter"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ── Helpers    ─────────────

function formatDisplay(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function inRange(day: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  return day > start && day < end;
}

/**
 * Parse "Web: 30, Java: 60" → [{ label: "Web", points: 30 }, { label: "Java", points: 60 }]
 */
function parseGradingRubric(raw: string): GradingRubricItem[] {
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((part) => {
      const [label, pts] = part.split(":").map((s) => s.trim());
      const points = parseInt(pts, 10);
      if (!label || isNaN(points)) return null;
      return { label, points };
    })
    .filter(Boolean) as GradingRubricItem[];
}

/** Derive attachment type from file extension */
function getAttachmentType(
  filename: string,
): "docx" | "zip" | "youtube" | "pdf" | "image" {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["zip", "rar", "7z"].includes(ext)) return "zip";
  if (["mp4", "mov", "avi", "webm"].includes(ext)) return "youtube";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
    return "image";
  return "docx";
}

/**
 * Map a browser File → AttachmentItem
 */
function mapFileToAttachment(file: File, index: number): AttachmentItem {
  return {
    id: Date.now() + index,
    name: file.name,
    type: getAttachmentType(file.name),
    size: `${(file.size / 1024).toFixed(1)} KB`,
    url: URL.createObjectURL(file),
    action: "Download",
  };
}

/** Calculate days between two dates */
function calcDaysUntilDeadline(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// ── Field Error    ─────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{message}</p>
  );
}

// ── Date Range Picker    ───

function DateRangePicker({
  startDate,
  endDate,
  onChange,
  onClose,
}: {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    startDate ? startDate.getMonth() : today.getMonth(),
  );
  const [viewYear, setViewYear] = useState(
    startDate ? startDate.getFullYear() : today.getFullYear(),
  );
  const [hovered, setHovered] = useState<Date | null>(null);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) onChange(day, null);
    else {
      if (day < startDate) onChange(day, startDate);
      else onChange(startDate, day);
    }
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const previewEnd = startDate && !endDate ? hovered : endDate;

  return (
    <div className="absolute top-full left-0 mt-2 z-[100] bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-[320px]">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-gray-400 font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = new Date(viewYear, viewMonth, i + 1);
          const isStart = startDate ? isSameDay(day, startDate) : false;
          const isEnd = endDate ? isSameDay(day, endDate) : false;
          const isInRange = inRange(day, startDate, previewEnd ?? null);
          const isHoverEnd =
            !endDate && hovered && startDate
              ? isSameDay(day, hovered) && day > startDate
              : false;

          let cellClass = "relative h-9 text-sm transition-colors select-none ";
          if (isStart || isEnd) {
            cellClass += "bg-blue-600 text-white font-semibold z-10 ";
            if (isStart && endDate)
              cellClass += "rounded-l-full rounded-r-none ";
            else if (isEnd && startDate)
              cellClass += "rounded-r-full rounded-l-none ";
            else cellClass += "rounded-full ";
          } else if (isInRange || isHoverEnd) {
            cellClass += "bg-blue-50 text-blue-700 ";
            if (isHoverEnd) cellClass += "rounded-r-full rounded-l-none ";
          } else {
            cellClass += "hover:bg-gray-100 text-gray-700 rounded-full ";
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => setHovered(day)}
              onMouseLeave={() => setHovered(null)}
              className={cellClass}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onChange(null, null)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={!startDate || !endDate}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// ── Main Component    ──────

export default function EditTaskModal({
  assessment,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [page, setPage] = useState(1);

  // Page 1 state
  const [title, setTitle] = useState("");
  const [acceptLate, setAcceptLate] = useState(true);
  const [instruction, setInstruction] = useState("");
  const [basicInfoErrors, setBasicInfoErrors] = useState<BasicInfoErrors>({});

  // Page 2 state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dailyRequired, setDailyRequired] = useState("60");
  const [point, setPoint] = useState("100");
  const [topic, setTopic] = useState("Web");
  const [topicOpen, setTopicOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["SR"]);
  const [gradingRubric, setGradingRubric] = useState("");
  const [existingAttachments, setExistingAttachments] = useState<
    AttachmentItem[]
  >([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [detailErrors, setDetailErrors] = useState<DetailErrors>({});

  const calendarRef = useRef<HTMLDivElement>(null);
  const topicRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing assessment data
  useEffect(() => {
    if (!assessment) return;
    setTitle(assessment.title || "");
    setAcceptLate(assessment.acceptLate ?? true);
    setInstruction(
      `${assessment.description || ""}\n\nREQUIREMENTS\n\n${
        assessment.requirements?.map((r: string) => `• ${r}`).join("\n") || ""
      }`,
    );
    setStartDate(assessment.startDate ? new Date(assessment.startDate) : null);
    setEndDate(assessment.endDate ? new Date(assessment.endDate) : null);
    setDailyRequired(assessment.requiredDailyMinutes?.toString() || "60");
    setPoint(assessment.points?.toString() || "100");
    setTopic(assessment.category || "Web");
    setSelectedClasses(assessment.classes || ["SR"]);
    // Normalise: whether stored as GradingRubricItem[] or a raw string, convert
    // to the editable string format "Label: Points, Label: Points"
    if (Array.isArray(assessment.gradingRubric)) {
      setGradingRubric(
        assessment.gradingRubric
          .map((item: GradingRubricItem) => `${item.label}: ${item.points}`)
          .join(", "),
      );
    } else {
      setGradingRubric(assessment.gradingRubric || "");
    }
    setExistingAttachments(assessment.attachments || []);
  }, [assessment]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      )
        setCalendarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (topicRef.current && !topicRef.current.contains(e.target as Node))
        setTopicOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayValue =
    startDate && endDate
      ? `${formatDisplay(startDate)} – ${formatDisplay(endDate)}`
      : startDate
        ? `${formatDisplay(startDate)} – ...`
        : "";

  const toggleClass = (value: string) => {
    setSelectedClasses((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
      e.target.value = "";
    }
  };

  const removeExisting = (index: number) => {
    setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    setNewAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Page 1 validation
  const handleBasicInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = basicInfoSchema.safeParse({
      title,
      acceptLate,
      instruction,
    });
    if (!result.success) {
      const errs: BasicInfoErrors = {};
      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof BasicInfoErrors;
        errs[key] = err.message;
      });
      setBasicInfoErrors(errs);
      return;
    }
    setBasicInfoErrors({});
    setPage(2);
  };

  // ── Page 2 validation
  const handleDetailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = detailSchema.safeParse({
      startDate,
      endDate,
      dailyRequired,
      point,
      topic,
      selectedClasses,
      gradingRubric,
    });

    if (!result.success) {
      const errs: DetailErrors = {};
      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof DetailErrors;
        errs[key] = err.message;
      });
      setDetailErrors(errs);
      return;
    }

    setDetailErrors({});

    //    Fix 1: parse gradingRubric string → GradingRubricItem[]
    const parsedRubric = parseGradingRubric(gradingRubric);

    //    Fix 2: map new File objects → AttachmentItem[], merge with existing
    const mappedNewAttachments = newAttachments.map((file, i) =>
      mapFileToAttachment(file, i),
    );

    //    Fix 3: calculate daysUntilDeadline
    const daysUntilDeadline = calcDaysUntilDeadline(startDate!, endDate!);

    const assessmentDate = `${formatDisplay(startDate)} - ${formatDisplay(endDate)}`;

    onSave({
      ...assessment,
      title,
      acceptLate,
      description: instruction,
      assessmentDate,
      startDate: formatDisplay(startDate!),
      endDate: formatDisplay(endDate!),
      daysUntilDeadline,
      requiredDailyMinutes: Number(dailyRequired),
      points: Number(point),
      category: topic,
      classes: selectedClasses,
      gradingRubric: parsedRubric,
      attachments: [...existingAttachments, ...mappedNewAttachments],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* ── Page 1 ── */}
      {page === 1 && (
        <form
          onSubmit={handleBasicInfoSubmit}
          className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
        >
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
                <Pencil className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Update Task</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the details to update the task
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={28} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (basicInfoErrors.title)
                    setBasicInfoErrors((p) => ({ ...p, title: undefined }));
                }}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition-all ${
                  basicInfoErrors.title
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              <FieldError message={basicInfoErrors.title} />
            </div>

            <Toggle
              checked={acceptLate}
              onChange={setAcceptLate}
              label="Accepting Submission After Deadline?"
            />

            <InstructionEditor
              label="Instruction (Optional)"
              value={instruction}
              onChange={setInstruction}
            />
          </div>

          <div className="mt-10 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      )}

      {/* ── Page 2 ── */}
      {page === 2 && (
        <form
          onSubmit={handleDetailSubmit}
          className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                <Pencil className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Update Task</h2>
                <p className="text-gray-500">
                  Fill in the details to update the task
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={26} />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[75vh] overflow-auto p-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Assessment Date */}
              <div className="col-span-2" ref={calendarRef}>
                <label className="mb-2 block text-sm font-semibold">
                  Assessment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    placeholder="dd/mm/yyyy – dd/mm/yyyy"
                    value={displayValue}
                    onClick={() => setCalendarOpen((o) => !o)}
                    className={`h-14 w-full cursor-pointer rounded-xl border px-5 pr-12 outline-none transition-all placeholder:text-gray-300 ${
                      detailErrors.startDate || detailErrors.endDate
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  <CalendarDays className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  {calendarOpen && (
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(s, e) => {
                        setStartDate(s);
                        setEndDate(e);
                        if (detailErrors.startDate || detailErrors.endDate)
                          setDetailErrors((p) => ({
                            ...p,
                            startDate: undefined,
                            endDate: undefined,
                          }));
                      }}
                      onClose={() => setCalendarOpen(false)}
                    />
                  )}
                </div>
                <FieldError
                  message={detailErrors.startDate ?? detailErrors.endDate}
                />
              </div>

              {/* Daily Required */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Daily Required (minutes){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={dailyRequired}
                  min={0}
                  onChange={(e) => {
                    setDailyRequired(e.target.value);
                    if (detailErrors.dailyRequired)
                      setDetailErrors((p) => ({
                        ...p,
                        dailyRequired: undefined,
                      }));
                  }}
                  className={`h-14 w-full rounded-xl border px-5 outline-none transition-all ${
                    detailErrors.dailyRequired
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                <FieldError message={detailErrors.dailyRequired} />
              </div>

              {/* Set Point */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Set Point <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={point}
                  min={0}
                  onChange={(e) => {
                    setPoint(e.target.value);
                    if (detailErrors.point)
                      setDetailErrors((p) => ({ ...p, point: undefined }));
                  }}
                  className={`h-14 w-full rounded-xl border px-5 outline-none transition-all ${
                    detailErrors.point
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                <FieldError message={detailErrors.point} />
              </div>

              {/* Select Topic */}
              <div className="relative col-span-2" ref={topicRef}>
                <label className="mb-2 block text-sm font-semibold">
                  Select Topic <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setTopicOpen((o) => !o)}
                  className={`flex h-14 w-full items-center justify-between rounded-xl border px-5 text-sm transition-colors ${
                    detailErrors.topic
                      ? "border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className={topic ? "text-gray-800" : "text-gray-300"}>
                    {topic || "Select Topic"}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${topicOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {topicOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {TOPICS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setTopic(item);
                          setTopicOpen(false);
                          setDetailErrors((p) => ({ ...p, topic: undefined }));
                        }}
                        className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
                <FieldError message={detailErrors.topic} />
              </div>
            </div>

            {/* Assign to Class */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold">
                Assign to Class <span className="text-red-500">*</span>
              </h3>
              <div className="flex gap-6">
                {["PVH", "SR", "PP"].map((cls) => (
                  <label
                    key={cls}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls)}
                      onChange={() => {
                        toggleClass(cls);
                        if (detailErrors.selectedClasses)
                          setDetailErrors((p) => ({
                            ...p,
                            selectedClasses: undefined,
                          }));
                      }}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">{cls}</span>
                  </label>
                ))}
              </div>
              <FieldError message={detailErrors.selectedClasses} />
            </div>

            {/* Grading Rubric */}
            <div className="mt-8">
              <label className="mb-1 block text-sm font-semibold">
                Grading Rubric
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Format:{" "}
                <span className="font-mono">Label: Points, Label: Points</span>
                &nbsp;— e.g.{" "}
                <span className="font-mono">
                  UI Design: 20, Responsiveness: 25
                </span>
              </p>
              <textarea
                rows={3}
                value={gradingRubric}
                onChange={(e) => setGradingRubric(e.target.value)}
                placeholder="UI Design: 20, Responsiveness: 25"
                className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {gradingRubric.trim() && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {parseGradingRubric(gradingRubric).map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                    >
                      {item.label}
                      <span className="font-semibold">{item.points} pts</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Attachments */}
            <div className="mt-8">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Link2 className="h-5 w-5" />
                <span className="font-medium">Upload Attachments</span>
                <PlusCircle className="h-5 w-5 text-green-500 fill-green-500 stroke-white" />
              </button>

              {(existingAttachments.length > 0 ||
                newAttachments.length > 0) && (
                <div className="mt-4 space-y-3">
                  {existingAttachments.map((file, i) => (
                    <div
                      key={`existing-${i}`}
                      className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 shrink-0 text-blue-600" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.size ?? "Existing"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExisting(i)}
                        className="ml-3 shrink-0 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {newAttachments.map((file, i) => (
                    <div
                      key={`new-${i}`}
                      className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 shrink-0 text-blue-600" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB · New
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNew(i)}
                        className="ml-3 shrink-0 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t px-8 py-5">
            <Button type="button" variant="outline" onClick={() => setPage(1)}>
              Back
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
