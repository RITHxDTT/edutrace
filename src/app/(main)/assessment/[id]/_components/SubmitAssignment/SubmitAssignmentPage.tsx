"use client";

import { submitAssignmentAction } from "@/actions/assessment.action";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { AssessmentType } from "@/types/assessment";
import { FolderOpen, Gallery, Paperclip2, Trash, Link as LinkIcon } from "iconsax-react";
import { File as FileIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { PrimaryInput } from "@/components/Inputs/PrimaryInputField";

type Props = {
  assessment: AssessmentType;
};

type SelectedFile = {
  id: string;
  file: File;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name: string, color?: string) {
  const ext = name.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? "")) {
    return <Gallery size={14} color={color} />;
  }

  if (["pdf", "zip", "doc", "docx", "txt"].includes(ext ?? "")) {
    return <FolderOpen size={14} color={color} />;
  }

  return <FileIcon size={14} color={color} />;
}

function getFileColor(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? "")) {
    return { bgColor: "bg-light-green", iconColor: "#009F15" };
  }

  if (["doc", "docx", "txt", "pdf"].includes(ext ?? "")) {
    return { bgColor: "bg-light-lavendar", iconColor: "#2E25C9" };
  }

  if (["zip"].includes(ext ?? "")) {
    return { bgColor: "bg-lighter-orange", iconColor: "#DEA20A" };
  }

  return { bgColor: "bg-input-field", iconColor: "#111827" };
}

export default function SubmitAssignmentPage({ assessment }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<SelectedFile | null>(null);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

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

  const handleSubmit = () => {
    if (!file) {
      setMessage("Please add a file before submitting.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file.file);
      formData.set("link", link.trim());

      const result = await submitAssignmentAction(
        assessment.assessmentId,
        formData,
      );

      if (!result.success) {
        setMessage(result.error ?? "Unable to submit assignment.");
        return;
      }

      setFile(null);
      setLink("");
      setMessage("Assignment submitted successfully.");
    });
  };

  return (
    <div className="grid grid-cols-[1fr_360px] gap-5 py-4">
      <div className="rounded-[20px] bg-white p-7.5">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[24px] font-semibold text-primary">Submit Assignment</p>
            <p className="text-sm text-tertiary">{assessment.title}</p>
          </div>

          <PrimaryButton
            size="md"
            onClick={handleSubmit}
            disabled={isPending}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Submitting..." : "Submit Work"}
          </PrimaryButton>
        </div>

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
                <div className={`${getFileColor(file.file.name).bgColor} shrink-0 rounded-full p-2`}>
                  {getFileIcon(file.file.name, getFileColor(file.file.name).iconColor)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-primary">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-tertiary">
                    {formatFileSize(file.file.size)}
                  </p>
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
