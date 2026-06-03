import { AssessmentSubmission, SubmissionResource } from "@/types/assessment";
import { formatDateLong } from "@/utils/formatDateLong";
import { FolderOpen, Gallery } from "iconsax-react";
import { File } from "lucide-react";

export function formatFileSize(bytes?: number) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getResourceFileName(resource: SubmissionResource) {
  if (resource.fileName) return resource.fileName;

  try {
    const url = new URL(resource.resourceUrl);
    return url.pathname.split("/").filter(Boolean).at(-1) || url.hostname;
  } catch {
    return resource.resourceUrl;
  }
}

export function getFileIcon(name: string, color?: string) {
  const ext = name.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? "")) {
    return <Gallery size={14} color={color} />;
  }

  if (["pdf", "zip", "doc", "docx", "txt"].includes(ext ?? "")) {
    return <FolderOpen size={14} color={color} />;
  }

  return <File size={14} color={color} />;
}

export function getFileColor(name: string) {
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

export function isViewableResource(resource: SubmissionResource) {
  const mimeType = resource.mimeType?.toLowerCase() ?? "";
  return (
    resource.resourceType === "LINK" ||
    mimeType.startsWith("image/") ||
    mimeType === "application/pdf" ||
    mimeType.startsWith("text/")
  );
}

export function getSubmittedLabel(submission: AssessmentSubmission) {
  if (!submission.submittedAt) return "Not submitted";
  return formatDateLong(submission.submittedAt);
}

export function getStudentInitials(name?: string) {
  if (!name) return "ST";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "ST";
}
