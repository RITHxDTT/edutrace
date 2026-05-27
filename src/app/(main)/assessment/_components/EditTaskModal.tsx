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

import Button from "./Button";
import InstructionEditor from "./InstructionEditor";
import Toggle from "./Toggle";

interface EditTaskModalProps {
  assessment?: any;
  onClose: () => void;
  onSave: (data: any) => void;
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

//          Date range picker           ───────────
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
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

//          Main modal        ─
export default function EditTaskModal({
  assessment,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [acceptLate, setAcceptLate] = useState(true);
  const [instruction, setInstruction] = useState("");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [dailyRequired, setDailyRequired] = useState("60");
  const [point, setPoint] = useState("100");
  const [topic, setTopic] = useState("Web");
  const [topicOpen, setTopicOpen] = useState(false);
  const topicRef = useRef<HTMLDivElement>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["SR"]);
  const [gradingRubric, setGradingRubric] = useState("");

  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
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
    setGradingRubric(
      Array.isArray(assessment.gradingRubric)
        ? assessment.gradingRubric
            .map((item: any) => `${item.label}: ${item.points}`)
            .join(", ")
        : assessment.gradingRubric || "",
    );
    setExistingAttachments(assessment.attachments || []);
  }, [assessment]);

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

  //          submit → advance to
  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  //           submit → call onSave
  const handleStep2Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      ...assessment,
      title,
      acceptLate,
      description: instruction,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      requiredDailyMinutes: Number(dailyRequired),
      points: Number(point),
      category: topic,
      classes: selectedClasses,
      gradingRubric,
      attachments: [...existingAttachments, ...newAttachments],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/*                            */}
      {step === 1 && (
        <form
          onSubmit={handleStep1Submit}
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
            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
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

      {/*                             */}
      {step === 2 && (
        <form
          onSubmit={handleStep2Submit}
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
              {/* Assessment Date — with working DateRangePicker */}
              <div className="col-span-2" ref={calendarRef}>
                <label className="mb-2 block text-sm font-semibold">
                  Assessment Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    placeholder="dd/mm/yyyy – dd/mm/yyyy"
                    value={displayValue}
                    onClick={() => setCalendarOpen((o) => !o)}
                    className="h-14 w-full cursor-pointer rounded-xl border border-gray-200 px-5 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                  />
                  <CalendarDays className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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
                <label className="mb-2 block text-sm font-semibold">
                  Daily Required (minutes)
                </label>
                <input
                  type="number"
                  value={dailyRequired}
                  min={0}
                  onChange={(e) => setDailyRequired(e.target.value)}
                  className="h-14 w-full rounded-xl border border-gray-200 px-5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Set Point */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Set Point
                </label>
                <input
                  type="number"
                  value={point}
                  min={0}
                  onChange={(e) => setPoint(e.target.value)}
                  className="h-14 w-full rounded-xl border border-gray-200 px-5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Select Topic */}
              <div className="relative col-span-2" ref={topicRef}>
                <label className="mb-2 block text-sm font-semibold">
                  Select Topic
                </label>
                <button
                  type="button"
                  onClick={() => setTopicOpen((o) => !o)}
                  className="flex h-14 w-full items-center justify-between rounded-xl border border-gray-200 px-5 text-sm hover:border-gray-300 transition-colors"
                >
                  <span>{topic}</span>
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
                        }}
                        className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assign to Class */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold">Assign to Class</h3>
              <div className="flex gap-6">
                {["PVH", "SR", "PP"].map((cls) => (
                  <label
                    key={cls}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls)}
                      onChange={() => toggleClass(cls)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">{cls}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Grading Rubric */}
            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold">
                Grading Rubric
              </label>
              <textarea
                rows={3}
                value={gradingRubric}
                onChange={(e) => setGradingRubric(e.target.value)}
                placeholder="UI Design:20, Responsiveness:25"
                className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
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
                <PlusCircle className="h-5 w-5 text-green-500" />
              </button>

              {(existingAttachments.length > 0 ||
                newAttachments.length > 0) && (
                <div className="mt-4 space-y-3">
                  {existingAttachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 shrink-0 text-blue-600" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">
                            {file.name || file.filename}
                          </p>
                          <p className="text-xs text-gray-500">Existing</p>
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
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 shrink-0 text-blue-600" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
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
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
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
