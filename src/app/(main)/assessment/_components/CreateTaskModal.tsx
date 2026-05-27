"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  X,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Link2,
  PlusCircle,
  FileText,
  Trash2,
} from "lucide-react";

import InstructionEditor from "./InstructionEditor";
import Button from "./Button";
import Toggle from "./Toggle";

interface CreateTaskModalProps {
  onClose?: () => void;
  onBack?: () => void;
  onCreate?: (data: {
    title: string;
    acceptLate: boolean;
    instruction: string;
    assessmentDate: string;
    dailyRequired: string;
    point: string;
    topic: string;
    classes: string[];
    gradingRubric: string;
    attachments: File[];
  }) => void;
}

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

// ── Inline date-range calendar ──────────────────────────────
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
    if (!startDate || (startDate && endDate)) {
      onChange(day, null);
    } else {
      if (day < startDate) onChange(day, startDate);
      else onChange(startDate, day);
    }
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const previewEnd = startDate && !endDate ? hovered : endDate;

  return (
    <div className="absolute top-full left-0 mt-2 z-[100] bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-[320px]">
      {/* Month nav */}
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

      {/* Day headers */}
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

      {/* Day cells */}
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

      {/* Actions */}
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

// ── Main modal ───────────────────────────────────────────────
export default function CreateTaskModal({
  onClose,
  onBack,
  onCreate,
}: CreateTaskModalProps) {
  const [step, setStep] = useState(1);

  // Step 1
  const [title, setTitle] = useState("");
  const [acceptLate, setAcceptLate] = useState(true);
  const [instruction, setInstruction] = useState("");

  // Step 2
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const topicRef = useRef<HTMLDivElement>(null);

  const [dailyRequired, setDailyRequired] = useState("");
  const [point, setPoint] = useState("");
  const [topic, setTopic] = useState("");
  const [gradingRubric, setGradingRubric] = useState("");
  const [topicOpen, setTopicOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // Upload
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close calendar on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close topic dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (topicRef.current && !topicRef.current.contains(e.target as Node)) {
        setTopicOpen(false);
      }
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

  // ── Step 1 form submit → advance to step 2
  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  // ── Step 2 form submit → call onCreate
  const handleStep2Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const assessmentDate =
      startDate && endDate
        ? `${formatDisplay(startDate)} - ${formatDisplay(endDate)}`
        : formatDisplay(startDate) || "";

    onCreate?.({
      title,
      acceptLate,
      instruction,
      assessmentDate,
      dailyRequired,
      point,
      topic,
      classes: selectedClasses,
      gradingRubric,
      attachments,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      {/* ── STEP 1 ── */}
      {step === 1 && (
        <form
          onSubmit={handleStep1Submit}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
        >
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
              type="text"
              placeholder="Assessment title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Toggle — controlled outside form validation */}
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

          <div className="flex items-center justify-between mt-6">
            <Button type="button" variant="outline" size="md" onClick={onBack}>
              Back
            </Button>
            {/* type="submit" advances to step 2 via handleStep1Submit */}
            <Button type="submit" variant="primary" size="md">
              Next
            </Button>
          </div>
        </form>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <form
          onSubmit={handleStep2Submit}
          className="w-full max-w-2xl rounded-3xl bg-white overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between">
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

          <div className="px-8 py-6">
            <div className="grid grid-cols-2 gap-5">
              {/* Assessment Date — full width */}
              <div className="col-span-2" ref={calendarRef}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Assessment Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    placeholder="dd/mm/yyyy – dd/mm/yyyy"
                    value={displayValue}
                    onClick={() => setCalendarOpen((o) => !o)}
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-12 outline-none focus:border-indigo-400 cursor-pointer text-sm text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  {calendarOpen && (
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(s, e) => {
                        setStartDate(s);
                        setEndDate(e);
                      }}
                      onClose={() => setCalendarOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* Daily Required */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Daily Required (minutes)
                </label>
                <input
                  type="number"
                  placeholder="60"
                  value={dailyRequired}
                  min={0}
                  onChange={(e) => setDailyRequired(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* Set Point */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Set Point
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={point}
                  min={0}
                  onChange={(e) => setPoint(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* Select Topic — full width */}
              <div className="relative col-span-2" ref={topicRef}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Select Topic
                </label>
                <button
                  type="button"
                  onClick={() => setTopicOpen((o) => !o)}
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 flex items-center justify-between text-sm hover:border-gray-300 transition-colors"
                >
                  <span className={topic ? "text-gray-800" : "text-gray-300"}>
                    {topic || "Select Topic"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${topicOpen ? "rotate-180" : ""}`}
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
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assign to Class */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Assign to Class
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
                      onChange={() => toggleClass(item)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Grading Rubric */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Grading Rubric
              </label>
              <textarea
                rows={3}
                placeholder="E.g Web: 30, Java: 60"
                value={gradingRubric}
                onChange={(e) => setGradingRubric(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 outline-none resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
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
          <div className="border-t border-gray-100 px-8 py-5 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setStep(1)}
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
              {/* type="submit" triggers handleStep2Submit */}
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
