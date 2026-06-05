import { SubmissionResource } from "@/types/assessment";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { formatFileSize, getFileColor, getFileIcon, getResourceFileName, isViewableFile } from "@/utils/fileUtils";

type Props = {
  resource: SubmissionResource;
};

export default function StudentWorkFileCard({ resource }: Props) {
  const fileName = getResourceFileName(resource);
  const colors = getFileColor(fileName);
  const canView = isViewableFile(resource);

  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] border border-[lab(90.952% -.0000596046 0)] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`${colors.bgColor} shrink-0 rounded-full p-2`}>
          <span className="text-primary shrink-0">
            {getFileIcon(fileName, colors.iconColor)}
          </span>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-primary">{fileName}</p>
          <p className="text-xs text-tertiary">
            {resource.resourceType ?? "FILE"} - {formatFileSize(resource.fileSize)}
          </p>
        </div>
      </div>

      <Link
        href={resource.resourceUrl}
        target={canView ? "_blank" : undefined}
        rel={canView ? "noreferrer" : undefined}
        download={!canView ? resource.fileName : undefined}
        className="flex shrink-0 items-center gap-1 text-sm font-medium text-attachment hover:underline"
      >
        {canView ? <Eye size={18} color="#5B5EDD" /> : <Download size={18} color="#5B5EDD" />}
        {canView ? "View" : "Download"}
      </Link>
    </div>
  );
}
