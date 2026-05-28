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

// ── Shake animation (add to your global CSS) ──────────────────────────────────
// @keyframes shake {
//   0%, 100% { transform: translateX(0); }
//   20%       { transform: translateX(-6px); }
//   40%       { transform: translateX(6px); }
//   60%       { transform: translateX(-4px); }
//   80%       { transform: translateX(4px); }
// }
// .input-shake { animation: shake 0.35s ease; }

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

export interface AttachmentItem {
  id: number;
  name: string;
  type: "docx" | "zip" | "youtube" | "pdf" | "image";
  size?: string;
  url: string;
  action: "Download" | "Open";
}

export interface GradingRubricItem {
  label: string;
  points: number;
}

interface CreateTaskModalProps {
  onClose?: () => void;
  onBack?: () => void;
  onCreate?: (data: {
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

function calcDaysUntilDeadline(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// ── Shake helper    ────────

function triggerShake(el: HTMLElement | null) {
  if (!el) return;
  el.classList.remove("input-shake");
  // Force reflow so animation restarts if already applied
  void el.offsetWidth;
  el.classList.add("input-shake");
}

// ── Field Error    ─────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{message}</p>
  );
}

// ── Input class helper    ──

function inputCls(hasError: boolean) {
  return `w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 outline-none transition-all ${
    hasError
      ? "border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
  }`;
}

function inputH12Cls(hasError: boolean) {
  return `w-full h-12 rounded-xl border px-4 text-sm text-gray-800 placeholder:text-gray-300 outline-none transition-all ${
    hasError
      ? "border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
  }`;
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
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
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
            cellClass += "bg-indigo-600 text-white font-semibold z-10 ";
            if (isStart && endDate)
              cellClass += "rounded-l-full rounded-r-none ";
            else if (isEnd && startDate)
              cellClass += "rounded-r-full rounded-l-none ";
            else cellClass += "rounded-full ";
          } else if (isInRange || isHoverEnd) {
            cellClass += "bg-indigo-50 text-indigo-700 ";
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
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// ── Main Component    ──────

export default function CreateTaskModal({
  onClose,
  onBack,
  onCreate,
}: CreateTaskModalProps) {
  const [page, setPage] = useState(1);

  // ── Page 1 state    ─────
  const [title, setTitle] = useState("");
  const [acceptLate, setAcceptLate] = useState(true);
  const [instruction, setInstruction] = useState("");
  const [basicInfoErrors, setBasicInfoErrors] = useState<BasicInfoErrors>({});

  // ── Page 1 refs (for shake + focus) ───────────────────────────────────────
  const titleRef = useRef<HTMLInputElement>(null);

  // ── Page 2 state    ─────
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dailyRequired, setDailyRequired] = useState("");
  const [point, setPoint] = useState("");
  const [topic, setTopic] = useState("");
  const [gradingRubric, setGradingRubric] = useState("");
  const [topicOpen, setTopicOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [detailErrors, setDetailErrors] = useState<DetailErrors>({});

  // ── Page 2 refs (for shake + focus) ───────────────────────────────────────
  const dateRef = useRef<HTMLInputElement>(null);
  const dailyRef = useRef<HTMLInputElement>(null);
  const pointRef = useRef<HTMLInputElement>(null);
  const topicBtnRef = useRef<HTMLButtonElement>(null);
  const classesSectionRef = useRef<HTMLDivElement>(null);

  const calendarRef = useRef<HTMLDivElement>(null);
  const topicRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Close on outside click ─────────────────────────────────────────────────
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
      ? `${formatDisplay(startDate)}  –  ${formatDisplay(endDate)}`
      : startDate
        ? `${formatDisplay(startDate)}  –  ...`
        : "";

  const toggleClass = (value: string) => {
    setSelectedClasses((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Page 1 submit    ────
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

      // Focus + shake the first errored field
      if (errs.title) {
        titleRef.current?.focus();
        triggerShake(titleRef.current);
      }
      return;
    }

    setBasicInfoErrors({});
    setPage(2);
  };

  // ── Page 2 submit    ────
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

      // Focus + shake the first errored field (in order of appearance)
      if (errs.startDate || errs.endDate) {
        dateRef.current?.focus();
        triggerShake(dateRef.current);
      } else if (errs.dailyRequired) {
        dailyRef.current?.focus();
        triggerShake(dailyRef.current);
      } else if (errs.point) {
        pointRef.current?.focus();
        triggerShake(pointRef.current);
      } else if (errs.topic) {
        triggerShake(topicBtnRef.current);
      } else if (errs.selectedClasses) {
        classesSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        triggerShake(classesSectionRef.current);
      }
      return;
    }

    setDetailErrors({});

    const parsedRubric = parseGradingRubric(gradingRubric);
    const daysUntilDeadline = calcDaysUntilDeadline(startDate!, endDate!);
    const mappedAttachments = attachments.map((file, i) =>
      mapFileToAttachment(file, i),
    );
    const assessmentDate = `${formatDisplay(startDate)} - ${formatDisplay(endDate)}`;

    const totalRubricPts = parsedRubric.reduce(
      (acc, item) => acc + item.points,
      0,
    );
    const pointsValue = Number(point);
    const passingScore = Math.round((totalRubricPts || pointsValue) * 0.6);

    onCreate?.({
      title,
      acceptLate,
      description: instruction,
      assessmentDate,
      startDate: startDate!.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      endDate: endDate!.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      daysUntilDeadline,
      requiredDailyMinutes: Number(dailyRequired),
      points: pointsValue,
      category: topic,
      classes: selectedClasses,
      gradingRubric: parsedRubric,
      passingScore,
      attachments: mappedAttachments,
      status: "Not Yet",
    });
  };

  // ── Render    ───────────

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      {/* ── Page 1 ── */}
      {page === 1 && (
        <form
          onSubmit={handleBasicInfoSubmit}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Pencil className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create Task</h2>
                <p className="text-sm text-gray-400">
                  Fill in the details to create a new task
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <div className="mb-5">
            <label className="text-sm font-semibold text-gray-800 mb-1.5 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="Assessment title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (basicInfoErrors.title)
                  setBasicInfoErrors((p) => ({ ...p, title: undefined }));
              }}
              className={inputCls(!!basicInfoErrors.title)}
            />
            <FieldError message={basicInfoErrors.title} />
          </div>

          {/* Accept Late Toggle */}
          <Toggle
            checked={acceptLate}
            onChange={setAcceptLate}
            label="Accepting Submission After Deadline?"
          />

          {/* Instruction */}
          <InstructionEditor
            label="Instruction"
            placeholder="your instruction..."
            optional={true}
            onChange={setInstruction}
          />

          {/* Footer */}
          <div className="flex items-center justify-between mt-6">
            <Button type="button" variant="outline" size="md" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" variant="primary" size="md">
              Next
            </Button>
          </div>
        </form>
      )}

      {/* ── Page 2 ── */}
      {page === 2 && (
        <form
          onSubmit={handleDetailSubmit}
          className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <Pencil className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create Task</h2>
                <p className="text-gray-400 mt-0.5 text-sm">
                  Fill in the details to create a new task
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="px-8 py-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-5">
              {/* Assessment Date */}
              <div className="col-span-2" ref={calendarRef}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Assessment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={dateRef}
                    type="text"
                    readOnly
                    placeholder="dd/mm/yyyy – dd/mm/yyyy"
                    value={displayValue}
                    onClick={() => setCalendarOpen((o) => !o)}
                    className={`${inputH12Cls(
                      !!(detailErrors.startDate || detailErrors.endDate),
                    )} cursor-pointer pr-12`}
                  />
                  <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Daily Required (minutes){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  ref={dailyRef}
                  type="number"
                  placeholder="60"
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
                  className={inputH12Cls(!!detailErrors.dailyRequired)}
                />
                <FieldError message={detailErrors.dailyRequired} />
              </div>

              {/* Set Point */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Set Point <span className="text-red-500">*</span>
                </label>
                <input
                  ref={pointRef}
                  type="number"
                  placeholder="100"
                  value={point}
                  min={0}
                  onChange={(e) => {
                    setPoint(e.target.value);
                    if (detailErrors.point)
                      setDetailErrors((p) => ({ ...p, point: undefined }));
                  }}
                  className={inputH12Cls(!!detailErrors.point)}
                />
                <FieldError message={detailErrors.point} />
              </div>

              {/* Select Topic */}
              <div className="relative col-span-2" ref={topicRef}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Select Topic <span className="text-red-500">*</span>
                </label>
                <button
                  ref={topicBtnRef}
                  type="button"
                  onClick={() => setTopicOpen((o) => !o)}
                  className={`w-full h-12 rounded-xl border px-4 flex items-center justify-between text-sm transition-colors ${
                    detailErrors.topic
                      ? "border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className={topic ? "text-gray-800" : "text-gray-300"}>
                    {topic || "Select Topic"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      topicOpen ? "rotate-180" : ""
                    }`}
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
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
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
            <div className="mt-6" ref={classesSectionRef}>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Assign to Class <span className="text-red-500">*</span>
              </h3>
              <div className="flex items-center gap-6">
                {["PVH", "SR", "PP"].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(item)}
                      onChange={() => {
                        toggleClass(item);
                        if (detailErrors.selectedClasses)
                          setDetailErrors((p) => ({
                            ...p,
                            selectedClasses: undefined,
                          }));
                      }}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{item}</span>
                  </label>
                ))}
              </div>
              <FieldError message={detailErrors.selectedClasses} />
            </div>

            {/* Grading Rubric */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Grading Rubric
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Format:{" "}
                <span className="font-mono">Label: Points, Label: Points</span>
                &nbsp;— e.g.{" "}
                <span className="font-mono">Web: 30, Java: 60</span>
              </p>
              <textarea
                rows={3}
                placeholder="E.g Web: 30, Java: 60"
                value={gradingRubric}
                onChange={(e) => setGradingRubric(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 outline-none resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              {gradingRubric.trim() && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {parseGradingRubric(gradingRubric).map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"
                    >
                      {item.label}
                      <span className="font-semibold">{item.points} pts</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Attachments */}
            <div className="mt-6">
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
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <Link2 className="w-4 h-4" />
                <span className="font-medium">Upload Attachments</span>
                <PlusCircle className="w-4 h-4 text-green-500 fill-green-500 stroke-white" />
              </button>

              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-3 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-8 py-5 flex items-center justify-between shrink-0">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setPage(1)}
            >
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Create
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
