"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  FileText,
  User,
  Calendar,
  Clock,
  Star,
  Paperclip,
  Download,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import { Assessment } from "../../../types";

interface Props {
  assessment: Assessment;
}

type Tab = "Instruction" | "Communication Room" | "Student Work";
const TABS: Tab[] = ["Instruction", "Communication Room", "Student Work"];

const SAMPLE_REQUIREMENTS = [
  "HTML, CSS, and JavaScript implementation",
  "Responsive layout",
  "Cross-browser compatibility",
  "Interactive buttons, forms, menus, or sliders",
  "Clean and reusable code",
  "Accessibility-friendly design",
  "Pixel-accurate design conversion",
  "Optimized images and assets",
];

const SAMPLE_ATTACHMENTS = [
  {
    name: "Project Requirements",
    type: "DOCX",
    size: "1.2 MB",
    action: "Download",
    color: "#5b52e8",
    colorBg: "#eff0fe",
    icon: "doc",
  },
  {
    name: "Project Setup Guidelines",
    type: "YouTube Link",
    size: null,
    action: "Open",
    color: "#ef4444",
    colorBg: "#fef2f2",
    icon: "play",
  },
  {
    name: "prerequisite-web-001",
    type: "ZIP",
    size: "5.2 MB",
    action: "Download",
    color: "#f59e0b",
    colorBg: "#fef9ee",
    icon: "zip",
  },
];

const SAMPLE_RUBRIC = [
  { label: "Code Quality", pts: 30 },
  { label: "Responsiveness", pts: 25 },
  { label: "Design Accuracy", pts: 25 },
  { label: "Documentation", pts: 20 },
];

const CATEGORY_ICON_BG: Record<string, string> = {
  Web: "bg-indigo-100 text-indigo-600",
  Java: "bg-orange-100 text-orange-600",
  "UX/UI": "bg-pink-100 text-pink-600",
  Flutter: "bg-cyan-100 text-cyan-600",
  General: "bg-gray-100 text-gray-600",
};

function DocIcon() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function ZipIcon() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  );
}
function AttachIcon({ icon }: { icon: string }) {
  if (icon === "play") return <PlayIcon />;
  if (icon === "zip") return <ZipIcon />;
  return <DocIcon />;
}

export default function AssessmentDetailPage({ assessment }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Instruction");

  const categoryBg =
    CATEGORY_ICON_BG[assessment.category] ?? CATEGORY_ICON_BG["General"];
  const totalPts = SAMPLE_RUBRIC.reduce((s, i) => s + i.pts, 0);

  return (
    <div className="flex-1 min-h-0 px-8 pt-7 pb-10 overflow-y-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link
          href="/assessment"
          className="hover:text-indigo-600 transition-colors"
        >
          Assessment
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">{assessment.title}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryBg}`}
          >
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
              {assessment.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Subject:{" "}
                <span className="text-gray-700 font-medium ml-1">
                  {assessment.category}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Assigned By:{" "}
                <span className="text-gray-700 font-medium ml-1">Tan Dara</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Start:{" "}
                <span className="text-gray-700 font-medium ml-1">
                  {assessment.startDate}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Due:{" "}
                <span className="text-gray-700 font-medium ml-1">
                  {assessment.endDate}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-800">
            {totalPts} Points
          </span>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Instruction tab */}
      {activeTab === "Instruction" && (
        <div className="grid grid-cols-[1fr_300px] gap-5">
          {/* Left */}
          <div className="flex flex-col gap-5">
            {/* Task Description */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <DocIcon />
                </div>
                <h2 className="text-base font-bold text-gray-900">
                  Task Description
                </h2>
              </div>
              <hr className="border-gray-100 mb-4" />
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                {assessment.description}
              </p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Requirements
              </p>
              <ul className="space-y-2">
                {SAMPLE_REQUIREMENTS.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Grading Rubric */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <Star className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">
                    Grading Rubric
                  </h2>
                </div>
                <span className="text-sm text-gray-400">
                  Total Points{" "}
                  <span className="font-bold text-indigo-600">
                    {totalPts} pts
                  </span>
                </span>
              </div>
              <hr className="border-gray-100 mb-4" />
              <div className="flex flex-wrap gap-2 mb-4">
                {SAMPLE_RUBRIC.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {item.pts} pts
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex rounded-full overflow-hidden h-1.5 mb-3 gap-0.5">
                {SAMPLE_RUBRIC.map((item, i) => (
                  <div
                    key={item.label}
                    style={{ flex: item.pts }}
                    className={`bg-indigo-500 ${i === 0 ? "rounded-l-full" : ""} ${i === SAMPLE_RUBRIC.length - 1 ? "rounded-r-full" : ""}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{SAMPLE_RUBRIC.length} criteria total</span>
                <span>
                  Passing score:{" "}
                  <strong className="text-gray-600">60 pts (60%)</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-5">
            {/* Attachments */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Attachments
                  </h2>
                  <p className="text-xs text-gray-400">
                    {SAMPLE_ATTACHMENTS.length} files
                  </p>
                </div>
              </div>
              <hr className="border-gray-100 my-4" />
              <div className="space-y-4">
                {SAMPLE_ATTACHMENTS.map((file, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ color: file.color, background: file.colorBg }}
                    >
                      <AttachIcon icon={file.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {file.type}
                        {file.size ? ` · ${file.size}` : ""}
                      </p>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600 flex-shrink-0 transition-colors">
                      {file.action === "Download" ? (
                        <Download className="w-3.5 h-3.5" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5" />
                      )}
                      {file.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Time */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900">
                  Assessment Time
                </h2>
              </div>
              <hr className="border-gray-100 mb-4" />
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      Required Daily (minutes)
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      60{" "}
                      <span className="text-sm font-normal text-gray-400">
                        min
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      Days until deadline
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      2{" "}
                      <span className="text-sm font-normal text-gray-400">
                        days
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Communication Room" && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-base font-medium text-gray-500">
            Communication Room
          </p>
          <p className="text-sm text-gray-400 mt-1">No messages yet</p>
        </div>
      )}

      {activeTab === "Student Work" && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-base font-medium text-gray-500">Student Work</p>
          <p className="text-sm text-gray-400 mt-1">No submissions yet</p>
        </div>
      )}
    </div>
  );
}
