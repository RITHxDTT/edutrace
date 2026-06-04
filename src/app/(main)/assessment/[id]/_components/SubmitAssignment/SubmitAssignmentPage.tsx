"use client";

import { submitAssignmentAction } from "@/actions/assessment.action";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { AssessmentSubmission, AssessmentType } from "@/types/assessment";
import { Paperclip2, Trash, Link as LinkIcon, TickCircle } from "iconsax-react";
import { useRef, useState, useTransition } from "react";
import { PrimaryInput } from "@/components/Inputs/PrimaryInputField";
import { useRouter } from "next/navigation";
import StudentWorkFileCard from "../StudentWork/StudentWorkFileCard";
import {
  formatFileSize,
  getFileColor,
  getFileIcon,
} from "../StudentWork/studentWorkUtils";

type Props = {
  assessment: AssessmentType;
  mySubmissions?: AssessmentSubmission[];
};

type SelectedFile = {
  id: string;
  file: File;
};

function hasSubmittedWork(status?: string) {
  const s = status?.toUpperCase();
  return s === "SUBMITTED" || s === "RESUBMITTED";
}

function getLatestSubmission(submissions: AssessmentSubmission[]): AssessmentSubmission | null {
  return (
    [...submissions]
      .sort(
        (a, b) =>
          new Date(b.submittedAt ?? 0).getTime() -
          new Date(a.submittedAt ?? 0).getTime(),
      )
      .find((s) => hasSubmittedWork(s.status)) ?? null
  );
}

function formatSubmittedAt(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SubmitAssignmentPage({ assessment, mySubmissions = [] }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<SelectedFile | null>(null);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const initialSubmission = getLatestSubmission(mySubmissions);
  const [currentSubmission, setCurrentSubmission] = useState<AssessmentSubmission | null>(
    initialSubmission,
  );
  const [isFormMode, setIsFormMode] = useState(!initialSubmission);

  const handleFiles = (selectedFiles: FileList | null) => {
    const selectedFile = selectedFiles?.[0];
    if (!selectedFile) return;
    setFile({
      id: `${selectedFile.name}-${selectedFile.lastModified}-${crypto.randomUUID()}`,
      file: selectedFile,
    });
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCancelResubmit = () => {
    setIsFormMode(false);
    setFile(null);
    setLink("");
    setMessage("");
  };

  const handleSubmit = () => {
    if (!file) {
      setMessage("Please add a file before submitting.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file.file);
      formData.set("link", link.trim());

      const result = await submitAssignmentAction(assessment.assessmentId, formData);

      if (!result.success) {
        setMessage(result.error ?? "Unable to submit assignment.");
        return;
      }

      // Optimistically show submitted state using the API response or local file info
      const newSubmission: AssessmentSubmission = {
        submissionId: result.data?.submissionId ?? crypto.randomUUID(),
        status: currentSubmission ? "RESUBMITTED" : "SUBMITTED",
        submittedAt: result.data?.submittedAt ?? new Date().toISOString(),
        submissionResources: result.data?.submissionResources ?? [
          {
            fileName: file.file.name,
            fileSize: file.file.size,
            mimeType: file.file.type,
            resourceType: "FILE",
            resourceUrl: "",
          },
        ],
      };

      setCurrentSubmission(newSubmission);
      setIsFormMode(false);
      setFile(null);
      setLink("");
      setMessage("");
      router.refresh();
    });
  };

  // Submitted state
  if (!isFormMode && currentSubmission) {
    const resources = currentSubmission.submissionResources ?? [];
    const isResubmitted = currentSubmission.status?.toUpperCase() === "RESUBMITTED";

    return (
      <div className="grid grid-cols-[1fr_360px] gap-5 py-4">
        <div className="rounded-[20px] bg-white p-7.5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[24px] font-semibold text-primary">Submit Assignment</p>
              <p className="text-sm text-tertiary">{assessment.title}</p>
            </div>

            <button
              type="button"
              onClick={() => setIsFormMode(true)}
              className="rounded-[10px] border border-red/30 bg-[#FCD3D3]/50 px-5 py-2 text-sm font-semibold text-red transition-colors hover:bg-[#FCD3D3]"
            >
              Unsubmit
            </button>
          </div>

          <div className="flex items-center gap-4 rounded-[14px] bg-light-green p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
              <TickCircle size={28} color="#009F15" variant="Bold" />
            </div>
            <div>
              <p className="text-[18px] font-semibold text-[#009F15]">
                {isResubmitted ? "Resubmitted" : "Submitted"}
              </p>
              {currentSubmission.submittedAt && (
                <p className="text-sm text-[#009F15]/80">
                  Turned in: {formatSubmittedAt(currentSubmission.submittedAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-7.5">
          <p className="mb-4 text-[18px] font-medium text-primary">Your Submission</p>

          <div className="flex flex-col gap-3">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <StudentWorkFileCard
                  key={resource.submissionResourceId ?? resource.resourceUrl}
                  resource={resource}
                />
              ))
            ) : (
              <p className="rounded-[10px] bg-input-field px-4 py-3 text-sm text-tertiary">
                No files attached.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Form state (initial submit or resubmit)
  const isResubmitMode = !!currentSubmission;

  return (
    <div className="grid grid-cols-[1fr_360px] gap-5 py-4">
      <div className="rounded-[20px] bg-white p-7.5">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[24px] font-semibold text-primary">
              {isResubmitMode ? "Resubmit Assignment" : "Submit Assignment"}
            </p>
            <p className="text-sm text-tertiary">{assessment.title}</p>
          </div>

          <div className="flex items-center gap-3">
            {isResubmitMode && (
              <button
                type="button"
                onClick={handleCancelResubmit}
                className="text-sm font-medium text-tertiary transition-colors hover:text-primary"
              >
                Cancel
              </button>
            )}

            <PrimaryButton
              size="md"
              onClick={handleSubmit}
              disabled={isPending}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Submitting..." : "Submit Work"}
            </PrimaryButton>
          </div>
        </div>

        {isResubmitMode && (
          <div className="mb-4 rounded-[10px] bg-accent-sand px-4 py-3 text-sm font-medium text-[#DEA20A]">
            You are resubmitting your work. A new submission will be created.
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-[15px] border-2 border-dashed border-[lab(90.952% -.0000596046 0)] bg-input-field text-center transition hover:border-menta/60"
        >
          <div className="rounded-full bg-light-lavendar p-4">
            <Paperclip2 size={28} color="#5B5EDD" />
          </div>
          <div>
            <p className="font-medium text-primary">Upload your completed work</p>
            <p className="text-sm text-tertiary">PDF, ZIP, document, image, or project files</p>
          </div>
        </button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />

        <div className="mt-6">
          <PrimaryInput
            label="Link / URL (Optional)"
            placeholder="e.g. https://github.com/your-username/project"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            inputType="primary"
            icon={LinkIcon}
            iconPosition="left"
          />
        </div>

        {message && (
          <p className="mt-4 rounded-[10px] bg-light-lavendar px-4 py-3 text-sm font-medium text-menta">
            {message}
          </p>
        )}
      </div>

      <div className="rounded-[20px] bg-white p-7.5">
        <p className="mb-4 text-[18px] font-medium text-primary">Selected File</p>

        <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
          {file ? (
            <div
              key={file.id}
              className="flex items-center justify-between gap-3 rounded-[8px] border border-[lab(90.952% -.0000596046 0)] px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`${getFileColor(file.file.name).bgColor} shrink-0 rounded-full p-2`}
                >
                  {getFileIcon(file.file.name, getFileColor(file.file.name).iconColor)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-primary">{file.file.name}</p>
                  <p className="text-xs text-tertiary">{formatFileSize(file.file.size)}</p>
                </div>
              </div>

              <button
                type="button"
                aria-label={`Remove ${file.file.name}`}
                onClick={() => setFile(null)}
                className="rounded-full bg-[#FCD3D3] p-1"
              >
                <Trash size={14} color="#ff2056" />
              </button>
            </div>
          ) : (
            <p className="rounded-[10px] bg-input-field px-4 py-3 text-sm text-tertiary">
              No file selected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
