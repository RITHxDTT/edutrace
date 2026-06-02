// src/app/(main)/report/_components/GenerateModalComponent.tsx
"use client";

import { useState, useRef } from "react";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { taskBaseReport, createClassReport } from "@/actions/report.action"; 
import { Edit2, XCircle, ChevronDown, Search, CheckCircle2 } from "lucide-react";

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateSuccess?: () => void;
}

const CLASS_OPTIONS = ["All Classes", "PVH", "SR", "PP"];
const TASK_OPTIONS = ["Loop_01", "Java_mini_project", "OOP_V1", "Parking_system"];

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

  if (!isOpen) return null;

  const filteredTasks = TASK_OPTIONS.filter((t) =>
    t.toLowerCase().includes(taskSearch.toLowerCase())
  );

  const canGenerate =
    reportName.trim() !== "" &&
    !isSubmitting &&
    (activeTab === "class"
      ? selectedClasses.length > 0 && startDate !== "" && endDate !== ""
      : selectedTask !== "");

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

  function toggleClass(cls: string) {
    if (cls === "All Classes") {
      setSelectedClasses((prev) =>
        prev.includes("All Classes") ? [] : CLASS_OPTIONS
      );
      return;
    }
    setSelectedClasses((prev) => {
      const next = prev.includes(cls)
        ? prev.filter((c) => c !== cls && c !== "All Classes")
        : [...prev.filter((c) => c !== "All Classes"), cls];
      if (next.length === CLASS_OPTIONS.length - 1) return CLASS_OPTIONS;
      return next;
    });
  }

  async function handleFormSubmit() {
    if (!canGenerate) return;
    setIsSubmitting(true);

    try {
      if (activeTab === "task") {
        // Prepare data payload structure according to your taskBaseReport schema
        await taskBaseReport({
          title: reportName,
          taskId: selectedTask, // Map to your correct payload ID configuration
        });
      } else {
        await createClassReport({
          title: reportName,
          subjectId: "default-subject-id", // Update with your actual subject scope
          classroomIds: selectedClasses.filter((c) => c !== "All Classes"),
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        });
      }
      
      onGenerateSuccess?.();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Error generating report. Please check configuration options.");
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
        className="bg-white rounded-2xl w-full max-w-lg mx-4 p-7 flex flex-col gap-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
              <Edit2 size={28} color="#3B82F6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Generate Report</h2>
              <p className="text-sm text-gray-400 mt-0.5">Fill in the details to generate a new report</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
            <XCircle size={24} />
          </button>
        </div>

        <div className="flex rounded-xl bg-gray-100 p-1">
          {(["class", "task"] as const).map((tab) => (
            <button
              key={tab}
              disabled={isSubmitting}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "class" ? "Class Based" : "Task Based"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">Report Name</label>
            <input
              type="text"
              disabled={isSubmitting}
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter report name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition disabled:bg-gray-50"
            />
          </div>

          {activeTab === "class" ? (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-800">Select Class</label>
                <div className="flex items-center gap-4 flex-wrap">
                  {CLASS_OPTIONS.map((cls) => (
                    <label key={cls} className="flex items-center gap-1.5 cursor-pointer select-none text-sm text-gray-700">
                      <input
                        type="checkbox"
                        disabled={isSubmitting}
                        checked={selectedClasses.includes(cls)}
                        onChange={() => toggleClass(cls)}
                        className="w-4 h-4 accent-indigo-500 rounded"
                      />
                      {cls}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Start Date", value: startDate, set: setStartDate },
                  { label: "End Date", value: endDate, set: setEndDate },
                ].map(({ label, value, set }) => (
                  <div key={label} className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-800">{label}</label>
                    <input
                      type="date"
                      disabled={isSubmitting}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition appearance-none disabled:bg-gray-50"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2" ref={dropdownRef}>
              <label className="text-sm font-bold text-gray-800">Select Tasks</label>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setTaskDropdownOpen((o) => !o)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-300 transition disabled:bg-gray-50"
              >
                <span className={selectedTask ? "text-gray-800" : "text-indigo-400"}>
                  {selectedTask || "Select Task"}
                </span>
                <ChevronDown size={18} color="#6366f1" className={`transition-transform ${taskDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {taskDropdownOpen && (
                <div className="border border-gray-100 rounded-2xl shadow-lg bg-white overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                    <Search size={16} color="#9CA3AF" />
                    <input
                      autoFocus
                      type="text"
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      placeholder="Search tasks..."
                      className="flex-1 text-sm outline-none placeholder:text-gray-300"
                    />
                  </div>
                  <ul className="max-h-48 overflow-y-auto">
                    {filteredTasks.length === 0 ? (
                      <li className="px-4 py-3 text-sm text-gray-400">No tasks found</li>
                    ) : (
                      filteredTasks.map((task) => (
                        <li
                          key={task}
                          onClick={() => {
                            setSelectedTask(task);
                            setTaskDropdownOpen(false);
                            setTaskSearch("");
                          }}
                          className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          {task}
                          {selectedTask === task && <CheckCircle2 size={18} color="#6366f1" />}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <PrimaryButton
            size="sm"
            disabled={!canGenerate}
            className={!canGenerate ? "opacity-40 cursor-not-allowed" : ""}
            onClick={handleFormSubmit}
          >
            {isSubmitting ? "Generating..." : "Generate"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}