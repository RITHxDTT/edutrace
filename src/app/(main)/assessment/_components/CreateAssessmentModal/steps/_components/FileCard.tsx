// components/Cards/AttachmentCard.tsx

import { FolderOpen, Gallery, Trash } from "iconsax-react";
import { X, FileText, Image, File } from "lucide-react";

type AttachmentFile = {
    id: string;
    file: File;
    name: string;
    size: string;
};

type Props = {
    attachment: AttachmentFile;
    onRemove: (id: string) => void;
};

function getFileIcon(name: string, color?: string) {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? ""))
        return <Gallery size={14} color={color} />;
    if (["pdf", "zip", "doc", "docx", "txt"].includes(ext ?? ""))
        return <FolderOpen size={14} color={color} />;
    return <File size={14} color={color} />;
}

function getFileColor(name: string) {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? ""))
        return { bgColor: "bg-light-green", iconColor: "#009F15" };
    if (["doc", "docx", "txt", "pdf"].includes(ext ?? ""))
        return { bgColor: "bg-light-lavendar", iconColor: "#2E25C9" };
    if (["zip"].includes(ext ?? ""))
        return { bgColor: "bg-lighter-orange", iconColor: "#DEA20A" };

}

export default function AttachmentCard({ attachment, onRemove }: Props) {
    const colors = getFileColor(attachment.name);

    console.log(colors?.bgColor)
    return (
        <div className="shrink-0 bg flex items-center gap-3 px-3 py-2 rounded-[8px] border w-[190px]">

            <div className={`${colors?.bgColor} rounded-full p-2`}>
                <span className="text-primary shrink-0">
                    {getFileIcon(attachment.name, colors?.iconColor)}
                </span>
            </div>


            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium text-primary truncate leading-tight">
                    {attachment.name}
                </span>
                <span className="text-[10px] text-tertiary leading-tight">
                    {attachment.size}
                </span>
            </div>

            <div className="bg-[#FCD3D3] rounded-full p-1">
                <Trash size={12} color="#ff2056" onClick={() => onRemove(attachment.id)} />
            </div>
        </div>
    );
}