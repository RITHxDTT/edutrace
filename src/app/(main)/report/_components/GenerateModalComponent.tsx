"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { z } from "zod";
import { generateReportSchema } from "@/zod/generateReportSchema";
import { DatePicker } from "@heroui/date-picker";
import { parseDate, CalendarDate } from "@internationalized/date";
import {
  GenerateReportModalProps,
  Classroom,
  Subject,
} from "@/types/classroom";

import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import {
  taskBaseReport,
  createClassReport,
  getTeacherAssessmentsAction,
  getTeacherClassesAction,
  getTeacherSubjectsAction,
} from "@/actions/report.action";

import {
  Edit2,
  XCircle,
  ChevronDown,
  Search,
  CheckCircle2,
} from "lucide-react";

const classReportSchema = generateReportSchema.extend({
  selectedClasses: z.array(z.string()).min(1, "Select at least one class"),
  selectedSubjects: z.array(z.string()).min(1, "Select at least one subject"),
});

const taskReportSchema = generateReportSchema.extend({
  selectedTask: z.string().min(1, "Select a task"),
});

export default function GenerateReportModalComponent({
  isOpen,
  onClose,
  onGenerateSuccess,
}: GenerateReportModalProps) {
  const [activeTab, setActiveTab] = useState<"class" | "task">("class");
  const [reportName, setReportName] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [startDate, setStartDate] = useState<CalendarDate | null>(null);
  const [endDate, setEndDate] = useState<CalendarDate | null>(null);

  const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: assessments = [], isLoading: loadingAssessments } = useSWR(
    isOpen && activeTab === "task" ? "teacher-assessments" : null,
    getTeacherAssessmentsAction,
  );

  const { data: classrooms = [], isLoading: loadingClasses } = useSWR<
    Classroom[]
  >(
    isOpen && activeTab === "class" ? "teacher-classes" : null,
    getTeacherClassesAction,
  );

  const { data: subjects = [], isLoading: loadingSubjects } = useSWR<Subject[]>(
    isOpen && activeTab === "class" ? "teacher-subjects" : null,
    getTeacherSubjectsAction,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setTaskDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setErrors({});
  }, [activeTab]);

  if (!isOpen) return null;

  const selectedAssessmentName = assessments.find(
    (a: any) => a.assessmentId === selectedTask,
  )?.title;

  function resetForm() {
    setReportName("");
    setSelectedClasses([]);
    setSelectedSubjects([]);
    setStartDate(null);
    setEndDate(null);
    setSelectedTask("");
    setTaskSearch("");
    setTaskDropdownOpen(false);
    setActiveTab("class");
    setErrors({});
  }

  function toggleSubject(subjectId: string) {
    setSelectedSubjects((prev) => {
      const next = prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId];

      if (next.length > 0) setErrors((e) => ({ ...e, selectedSubjects: "" }));
      return next;
    });
  }

  function toggleClass(classId: string) {
    setSelectedClasses((prev) => {
      let next;
      if (classId === "ALL") {
        const allIds = classrooms.map((c) => c.classroomId);
        const isAllSelected =
          prev.includes("ALL") || allIds.every((id) => prev.includes(id));
        next = isAllSelected ? [] : ["ALL", ...allIds];
      } else {
        const withoutAll = prev.filter((id) => id !== "ALL");
        next = withoutAll.includes(classId)
          ? withoutAll.filter((id) => id !== classId)
          : [...withoutAll, classId];
      }

      if (next.length > 0) setErrors((e) => ({ ...e, selectedClasses: "" }));
      return next;
    });
  }

  async function handleFormSubmit() {
    const formData = {
      eportName: reportName.trim(),
      startDate: startDate?.toString() ?? "",
      endDate: endDate?.toString() ?? "",
      ...(activeTab === "class"
        ? { selectedClasses, selectedSubjects }
        : { selectedTask }),
    };

    const schema = activeTab === "class" ? classReportSchema : taskReportSchema;

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      if (result.error && result.error.issues) {
        result.error.issues.forEach((err) => {
          if (err.path && err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
      }

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      if (activeTab === "task") {
        await taskBaseReport({
          title: reportName,
          assessmentId: selectedTask,
          startDate: startDate?.toString() ?? "",
          endDate: endDate?.toString() ?? "",
        });
      } else {
        await createClassReport({
          title: reportName,
          subjectIds: selectedSubjects,
          classroomIds: selectedClasses.includes("ALL") ? [] : selectedClasses,
          startDate: startDate?.toString() ?? "",
          endDate: endDate?.toString() ?? "",
        });
      }

      onGenerateSuccess?.();
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Edit2 size={28} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Generate Report
              </h2>
              <p className="text-gray-400 text-sm">Fill details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
          {(["class", "task"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab === "class" ? "Class Based" : "Task Based"}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Report Name
            </label>
            <input
              placeholder="Report Name"
              value={reportName}
              onChange={(e) => {
                setReportName(e.target.value);
                if (errors.reportName) setErrors({ ...errors, reportName: "" });
              }}
              className={`w-full border rounded-xl p-3 outline-none transition-colors ${
                errors.reportName
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
            {errors.reportName && (
              <p className="text-red-500 text-xs mt-1">{errors.reportName}</p>
            )}
          </div>

          {activeTab === "class" ? (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Select Subjects
                </label>
                <div
                  className={`flex gap-4 flex-wrap p-3 bg-gray-50 border rounded-xl max-h-32 overflow-auto ${
                    errors.selectedSubjects
                      ? "border-red-500"
                      : "border-gray-150"
                  }`}
                >
                  {loadingSubjects ? (
                    <span className="text-sm text-gray-400">
                      Loading subjects...
                    </span>
                  ) : subjects.length === 0 ? (
                    <span className="text-sm text-gray-400">
                      No subjects found.
                    </span>
                  ) : (
                    subjects.map((sub) => (
                      <label
                        key={sub.subjectId}
                        className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 select-none"
                      >
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 border-gray-300 w-4 h-4 focus:ring-blue-500"
                          checked={selectedSubjects.includes(sub.subjectId)}
                          onChange={() => toggleSubject(sub.subjectId)}
                        />
                        {sub.subjectName}
                      </label>
                    ))
                  )}
                </div>
                {errors.selectedSubjects && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.selectedSubjects}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Target Classrooms
                </label>
                <div
                  className={`flex gap-4 flex-wrap p-3 bg-gray-50 border rounded-xl max-h-32 overflow-auto ${
                    errors.selectedClasses
                      ? "border-red-500"
                      : "border-gray-150"
                  }`}
                >
                  {loadingClasses ? (
                    <span className="text-sm text-gray-400">
                      Loading classes...
                    </span>
                  ) : classrooms.length === 0 ? (
                    <span className="text-sm text-gray-400">
                      No classes found.
                    </span>
                  ) : (
                    <>
                      {/* <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 select-none">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 border-gray-300 w-4 h-4 focus:ring-blue-500"
                          checked={selectedClasses.includes("ALL")}
                          onChange={() => toggleClass("ALL")}
                        />
                        All Classes
                      </label> */}

                      {classrooms.map((cls) => (
                        <label
                          key={cls.classroomId}
                          className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 select-none"
                        >
                          <input
                            type="checkbox"
                            className="rounded text-blue-600 border-gray-300 w-4 h-4 focus:ring-blue-500"
                            checked={selectedClasses.includes(cls.classroomId)}
                            onChange={() => toggleClass(cls.classroomId)}
                          />
                          {cls.classroomAbbre}
                        </label>
                      ))}
                    </>
                  )}
                </div>
                {errors.selectedClasses && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.selectedClasses}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div ref={dropdownRef} className="relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Target Assessment Task
              </label>
              <button
                type="button"
                className={`w-full border rounded-xl p-3 flex justify-between items-center text-left bg-white ${
                  errors.selectedTask ? "border-red-500" : ""
                }`}
                onClick={() => setTaskDropdownOpen((o) => !o)}
              >
                <span
                  className={
                    selectedAssessmentName ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {selectedAssessmentName || "Select Task"}
                </span>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {errors.selectedTask && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.selectedTask}
                </p>
              )}

              {taskDropdownOpen && (
                <div className="absolute left-0 right-0 z-50 border bg-white rounded-xl mt-2 shadow-lg max-h-56 overflow-hidden flex flex-col">
                  <div className="flex p-3 border-b bg-gray-50 items-center">
                    <Search size={16} className="text-gray-400 flex-shrink-0" />
                    <input
                      placeholder="Filter by title..."
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      className="flex-1 outline-none ml-2 bg-transparent text-sm text-gray-700"
                    />
                  </div>
                  <ul className="max-h-40 overflow-auto py-1">
                    {loadingAssessments ? (
                      <li className="p-3 text-sm text-gray-400">Loading...</li>
                    ) : (
                      assessments
                        .filter((assessment: any) =>
                          assessment.title
                            .toLowerCase()
                            .includes(taskSearch.toLowerCase()),
                        )
                        .map((assessment: any) => (
                          <li
                            key={assessment.assessmentId}
                            onClick={() => {
                              setSelectedTask(assessment.assessmentId);
                              setTaskDropdownOpen(false);
                              if (errors.selectedTask)
                                setErrors({ ...errors, selectedTask: "" });
                            }}
                            className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center text-sm text-gray-700 transition"
                          >
                            {assessment.title}
                            {selectedTask === assessment.assessmentId && (
                              <CheckCircle2
                                size={18}
                                className="text-blue-600"
                              />
                            )}
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Analysis Window
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(value) => {
                    setStartDate(value);

                    if (errors.startDate) {
                      setErrors((prev) => ({
                        ...prev,
                        startDate: "",
                      }));
                    }
                  }}
                  variant="bordered"
                  radius="lg"
                  showMonthAndYearPickers
                  className="w-full"
                  isInvalid={!!errors.startDate}
                  errorMessage={errors.startDate}
                />
              </div>
              <div>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(value) => {
                    setEndDate(value);

                    if (errors.endDate) {
                      setErrors((prev) => ({
                        ...prev,
                        endDate: "",
                      }));
                    }
                  }}
                  variant="bordered"
                  radius="lg"
                  showMonthAndYearPickers
                  className="w-full"
                  isInvalid={!!errors.endDate}
                  errorMessage={errors.endDate}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 border-t pt-5">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </button>

          <PrimaryButton onClick={handleFormSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Generating..." : "Generate"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
