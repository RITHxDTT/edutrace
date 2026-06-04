"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import {
  taskBaseReport,
  createClassReport,
  getTeacherAssessmentsAction,
  getTeacherClassesAction, 
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Tasks
  const { data: assessments = [], isLoading: loadingAssessments } = useSWR(
    isOpen && activeTab === "task" ? "teacher-assessments" : null,
    getTeacherAssessmentsAction
  );

  // Fetch Classes dynamically using SWR
  const { data: classrooms = [], isLoading: loadingClasses } = useSWR<Classroom[]>(
    isOpen && activeTab === "class" ? "teacher-classes" : null,
    getTeacherClassesAction
  );

  if (!isOpen) return null;

  const selectedAssessmentName = assessments.find(
    (a: any) => a.assessmentId === selectedTask
  )?.title;

  const canGenerate =
    reportName.trim() !== "" &&
    !isSubmitting &&
    (activeTab === "class"
      ? selectedClasses.length > 0 && startDate && endDate
      : selectedTask && startDate && endDate);

  function resetForm() {
    setReportName("");
    setSelectedClasses([]);
    setStartDate("");
    setEndDate("");
    setSelectedTask("");
    setTaskSearch("");
    setTaskDropdownOpen(false);
    setActiveTab("class");
  }

  function toggleClass(classId: string) {
    if (classId === "ALL") {
      setSelectedClasses((prev) =>
        prev.includes("ALL") ? [] : ["ALL", ...classrooms.map((c) => c.classroomId)]
      );
      return;
    }

    setSelectedClasses((prev) => {
      const next = prev.includes(classId)
        ? prev.filter((id) => id !== classId && id !== "ALL")
        : [...prev.filter((id) => id !== "ALL"), classId];

      // If all individual classes are selected, automatically check "All Classes"
      if (next.length === classrooms.length) {
        return ["ALL", ...next];
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
          subjectId: "default-subject-id",
          // Send real database IDs (excluding the "ALL" keyword)
          classroomIds: selectedClasses.filter((id) => id !== "ALL"),
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
        <div className="flex justify-between mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Edit2 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Generate Report</h2>
              <p className="text-gray-400 text-sm">Fill details below</p>
            </div>
          </div>
          <button onClick={onClose}>
            <XCircle />
          </button>
        </div>

        <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
          {(["class", "task"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg ${
                activeTab === tab ? "bg-white shadow" : ""
              }`}
            >
              {tab === "class" ? "Class Based" : "Task Based"}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <input
            placeholder="Report Name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          {activeTab === "class" ? (
            <div className="flex gap-4 flex-wrap">
              {loadingClasses ? (
                <span className="text-sm text-gray-500">Loading classes...</span>
              ) : classrooms.length === 0 ? (
                <span className="text-sm text-gray-500">No classes found.</span>
              ) : (
                <>
                  {/* Static All Classes Checkbox */}
                  <label key="ALL" className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes("ALL")}
                      onChange={() => toggleClass("ALL")}
                    />
                    All Classes
                  </label>
                  
                  {/* Dynamic Class Checkboxes */}
                  {classrooms.map((cls) => (
                    <label key={cls.classroomId} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cls.classroomId)}
                        onChange={() => toggleClass(cls.classroomId)}
                      />
                      {/* Using classroomAbbre to show "SR" instead of "Siem Reap" */}
                      {cls.classroomAbbre} 
                    </label>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div ref={dropdownRef}>
              <button
                className="w-full border rounded-xl p-3 flex justify-between"
                onClick={() => setTaskDropdownOpen((o) => !o)}
              >
                {selectedAssessmentName || "Select Task"}
                <ChevronDown />
              </button>

              {taskDropdownOpen && (
                <div className="border rounded-xl mt-2">
                  <div className="flex p-3 border-b">
                    <Search size={16} />
                    <input
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      className="flex-1 outline-none ml-2"
                    />
                  </div>

                  <ul className="max-h-48 overflow-auto">
                    {loadingAssessments ? (
                      <li className="p-4">Loading...</li>
                    ) : (
                      assessments
                        .filter((assessment: any) =>
                          assessment.title
                            .toLowerCase()
                            .includes(taskSearch.toLowerCase())
                        )
                        .map((assessment: any) => (
                          <li
                            key={assessment.assessmentId}
                            onClick={() => {
                              setSelectedTask(assessment.assessmentId);
                              setTaskDropdownOpen(false);
                            }}
                            className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between"
                          >
                            {assessment.title}
                            {selectedTask === assessment.assessmentId && (
                              <CheckCircle2 size={18} />
                            )}
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-xl p-3"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-xl p-3"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
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