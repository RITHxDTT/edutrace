"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";

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

interface Classroom {
  classroomId: string;
  className: string;
  classroomAbbre: string;
}

interface Subject {
  subjectId: string ;
  subjectName: string;
}

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateSuccess?: () => void;
}

export default function GenerateReportModalComponent({
  isOpen,
  onClose,
  onGenerateSuccess,
}: GenerateReportModalProps) {
  const [activeTab, setActiveTab] = useState<"class" | "task">("class");
  const [reportName, setReportName] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!isOpen) return null;

  const selectedAssessmentName = assessments.find(
    (a: any) => a.assessmentId === selectedTask,
  )?.title;

  
  const canGenerate =
    reportName.trim() !== "" &&
    !isSubmitting &&
    (activeTab === "class"
      ? selectedClasses.length > 0 &&
        selectedSubjects.length > 0 &&
        startDate &&
        endDate
      : selectedTask && startDate && endDate);

  function resetForm() {
    setReportName("");
    setSelectedClasses([]);
    setSelectedSubjects([]);
    setStartDate("");
    setEndDate("");
    setSelectedTask("");
    setTaskSearch("");
    setTaskDropdownOpen(false);
    setActiveTab("class");
  }

  
  function toggleSubject(subjectId: string) {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  }

  
  function toggleClass(classId: string) {
    setSelectedClasses((prev) => {
      if (classId === "ALL") {
        const allIds = classrooms.map((c) => c.classroomId);
        const isAllSelected =
          prev.includes("ALL") || allIds.every((id) => prev.includes(id));
        return isAllSelected ? [] : ["ALL", ...allIds];
      }

      const withoutAll = prev.filter((id) => id !== "ALL");
      let next;

      if (withoutAll.includes(classId)) {
        next = withoutAll.filter((id) => id !== classId);
      } else {
        next = [...withoutAll, classId];
      }
      return next;
    });
  }

  async function handleFormSubmit() {
    if (!canGenerate) return;
    setIsSubmitting(true);

    try {
      if (activeTab === "task") {
        await taskBaseReport({
          title: reportName,
          assessmentId: selectedTask,
          startDate,
          endDate,
        });
      } else {
        await createClassReport({
          title: reportName,
          subjectIds: selectedSubjects,
          classroomIds: selectedClasses.includes("ALL") ? [] : selectedClasses,
          startDate,
          endDate,
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
        {/* Modal Header */}
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
              onChange={(e) => setReportName(e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {activeTab === "class" ? (
            <>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Select Subjects
                </label>
                <div className="flex gap-4 flex-wrap p-3 bg-gray-50 border border-gray-150 rounded-xl max-h-32 overflow-auto">
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
              </div>

              {/* Classrooms Checkbox Selection Area Widget */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Target Classrooms
                </label>
                <div className="flex gap-4 flex-wrap p-3 bg-gray-50 border border-gray-150 rounded-xl max-h-32 overflow-auto">
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
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 select-none">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 border-gray-300 w-4 h-4 focus:ring-blue-500"
                          checked={selectedClasses.includes("ALL")}
                          onChange={() => toggleClass("ALL")}
                        />
                        All Classes
                      </label>

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
              </div>
            </>
          ) : (
            /* Task-Based dropdown picker configuration block */
            <div ref={dropdownRef} className="relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Target Assessment Task
              </label>
              <button
                type="button"
                className="w-full border rounded-xl p-3 flex justify-between items-center text-left bg-white"
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

          {/* Analysis Window Dates Row Context */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Analysis Window
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Action Controls Footer Row */}
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
          <PrimaryButton onClick={handleFormSubmit} disabled={!canGenerate}>
            {isSubmitting ? "Generating..." : "Generate"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
