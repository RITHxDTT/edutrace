import { AssessmentResource } from "@/types/assessment";
import { Paperclip2 } from "iconsax-react";
import AssessmentSectionCard from "../AssessmentSectionCard";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { formatFileSize, getFileColor, getFileIcon, getResourceFileName, isViewableFile } from "@/utils/fileUtils";

type Props = {
    resources: AssessmentResource[];
};

export default function AttachmentDetailPage({ resources }: Props) {
    return (
        <AssessmentSectionCard title="Attachment Details" icon={Paperclip2}>
            <div className="h-[410px] overflow-y-auto rounded-[15px] rounded-t-none border-1 border-t-0 border-[lab(90.952% -.0000596046 0)] bg-white p-[30px]">
                <div className="flex flex-col gap-3">
                    {resources.length > 0 ? resources.map((resource) => {
                        const fileName = getResourceFileName(resource);
                        const colors = getFileColor(fileName);

                        return (
                            <div
                                key={resource.assessmentResourceId ?? resource.resourceUrl}
                                className="flex items-center justify-between gap-3 rounded-[8px] border border-[lab(90.952% -.0000596046 0)] px-4 py-3"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className={`${colors.bgColor} shrink-0 rounded-full p-2`}>
                                        <span className="text-primary shrink-0">
                                            {getFileIcon(fileName, colors.iconColor)}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-primary">
                                            {fileName}
                                        </p>
                                        <p className="text-xs text-tertiary">
                                            {resource.resourceType ?? "FILE"} - {formatFileSize(resource.fileSize)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    {isViewableFile(resource) ? (
                                        <Link
                                            href={resource.resourceUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex gap-1 text-sm font-medium text-attachment hover:underline"
                                        >
                                            <Eye size={18} color="#5B5EDD" />
                                            View
                                        </Link>
                                    ) : (
                                        <Link
                                            href={resource.resourceUrl}
                                            download={resource.fileName}
                                            className="flex gap-1 text-sm font-medium text-attachment hover:underline"
                                        >
                                            <Download size={18} color="#5B5EDD" />
                                            Download
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="text-sm text-tertiary">No attachments provided.</p>
                    )}
                </div>
            </div>
        </AssessmentSectionCard>
    );
}
