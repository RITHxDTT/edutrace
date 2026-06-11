import { FolderOpen, Gallery } from "iconsax-react";
import { File } from "lucide-react";

export interface FileResourceBase {
  resourceUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  resourceType?: "LINK" | "FILE" | string;
}

export type FileIconColors = {
  bgColor: string;
  iconColor: string;
};

export function formatFileSize(bytes?: number): string {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileColor(name: string): FileIconColors {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? ""))
    return { bgColor: "bg-light-green", iconColor: "#009F15" };
  if (["doc", "docx", "txt", "pdf"].includes(ext ?? ""))
    return { bgColor: "bg-light-lavendar", iconColor: "#2E25C9" };
  if (["zip"].includes(ext ?? ""))
    return { bgColor: "bg-lighter-orange", iconColor: "#DEA20A" };
  return { bgColor: "bg-input-field", iconColor: "#111827" };
}

export function getFileIcon(name: string, color?: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? ""))
    return <Gallery size={14} color={color} />;
  if (["pdf", "zip", "doc", "docx", "txt"].includes(ext ?? ""))
    return <FolderOpen size={14} color={color} />;
  return <File size={14} color={color} />;
}

export function getResourceFileName(resource: FileResourceBase): string {
  if (resource.resourceType === "LINK") {
    try {
      const { hostname, pathname } = new URL(resource.resourceUrl);
      const host = hostname.replace(/^www\./, "");
      const path = pathname !== "/" ? pathname : "";
      return `${host}${path}`;
    } catch {
      return resource.resourceUrl;
    }
  }
  if (resource.fileName) return resource.fileName;
  try {
    const url = new URL(resource.resourceUrl);
    return url.pathname.split("/").filter(Boolean).at(-1) ?? url.hostname;
  } catch {
    return resource.resourceUrl;
  }
}

export function isViewableFile(resource: FileResourceBase): boolean {
  const mimeType = resource.mimeType?.toLowerCase() ?? "";
  return (
    resource.resourceType === "LINK" ||
    mimeType.startsWith("image/") ||
    mimeType === "application/pdf" ||
    mimeType.startsWith("text/")
  );
}
