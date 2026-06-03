"use client"

import PrimaryInput from "@/components/Inputs/PrimaryInputField";
import PrimarySelect from "@/components/Selects/PrimarySelect";
import { AssessmentResource, CreateAssessmentForm } from "@/types/assessment";
import { ClassroomType } from "@/types/classroom";
import { SubjectType } from "@/types/subject";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { DateRangePicker } from "@heroui/date-picker";
import { SelectItem } from "@heroui/select";
import { useState, KeyboardEvent, useRef } from "react";
import { File, Paperclip } from "lucide-react";
import AttachmentCard from "./_components/FileCard";
import { FolderOpen, Gallery } from "iconsax-react";
import { parseDate } from "@internationalized/date";

type Props = {
    form: CreateAssessmentForm;
    onChange: <K extends keyof CreateAssessmentForm>(
        key: K,
        value: CreateAssessmentForm[K],
    ) => void;
    subjects: SubjectType[];
    taughtClassrooms: ClassroomType[];
    existingResources?: AssessmentResource[];
    mode?: "create" | "edit";
};

type RubricBadge = {
    label: string;
    score: number;
};

type AttachmentFile = {
    id: string;
    file: File;
    name: string;
    size: string;
};

function parseRubricInput(input: string): RubricBadge[] {
    return input
        .split(";")
        .map((part) => part.trim())
        .filter((part) => part.includes(":"))
        .map((part) => {
            const [label, score] = part.split(":");
            return { label: label.trim(), score: Number(score.trim()) };
        })
        .filter((b) => b.label && !isNaN(b.score));
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatResourceSize(bytes?: number): string {
    if (!bytes) return "Existing file";
    return formatFileSize(bytes);
}

function getFileNameFromResource(resource: AssessmentResource) {
    if (resource.fileName) return resource.fileName;

    try {
        const url = new URL(resource.resourceUrl);
        return url.pathname.split("/").filter(Boolean).at(-1) ?? resource.resourceUrl;
    } catch {
        return resource.resourceUrl;
    }
}

function getFileIcon(name: string, color?: string) {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? "")) {
        return <Gallery size={14} color={color} />;
    }
    if (["pdf", "zip", "doc", "docx", "txt"].includes(ext ?? "")) {
        return <FolderOpen size={14} color={color} />;
    }
    return <File size={14} color={color} />;
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

function getDateOnlyValue(value: string) {
    return parseDate(value.slice(0, 10));
}

export default function StepAssessment({
    form,
    onChange,
    subjects,
    taughtClassrooms,
    existingResources = [],
    mode = "create",
}: Props) {
    const selectedClassroomIds =
        mode === "edit" && form.classroomIds.length === 0
            ? taughtClassrooms.map((classroom) => classroom.classroomId)
            : form.classroomIds;
    const allSelected =
        taughtClassrooms.length > 0 && selectedClassroomIds.length === taughtClassrooms.length;

    const [rubricInput, setRubricInput] = useState(form.gradingRubric);
    const [rubricBadges, setRubricBadges] = useState<RubricBadge[]>(
        () => parseRubricInput(form.gradingRubric),
    );
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRubricKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const parsed = parseRubricInput(rubricInput);
            if (parsed.length > 0) {
                setRubricBadges(parsed);
                onChange("gradingRubric", rubricInput);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const newAttachments: AttachmentFile[] = files.map((file) => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            name: file.name,
            size: formatFileSize(file.size),
        }));
        setAttachments((prev) => [...prev, ...newAttachments]);
        onChange("files", [...form.files, ...files]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeAttachment = (id: string) => {
        setAttachments((prev) => {
            const removed = prev.find((attachment) => attachment.id === id);
            if (removed) {
                onChange(
                    "files",
                    form.files.filter((file) => file !== removed.file),
                );
            }

            return prev.filter((a) => a.id !== id);
        });
    };

    return (
        <>
            <div className="w-full grid grid-cols-2 gap-2">
                <DateRangePicker
                    className="w-full"
                    label="Assessment Date"
                    labelPlacement="outside-top"
                    value={
                        form.startAt && form.dueAt
                            ? {
                                start: getDateOnlyValue(form.startAt),
                                end: getDateOnlyValue(form.dueAt),
                            }
                            : null
                    }
                    onChange={(range) => {
                        onChange("startAt", range?.start ? new Date(`${range.start.toString()}T00:00:00`).toISOString() : "");
                        onChange("dueAt", range?.end ? new Date(`${range.end.toString()}T23:59:59`).toISOString() : "");
                    }}
                    classNames={{
                        base: "font-sans",
                        label: "font-semibold text-label mb-1.5 transition-colors duration-150 group-focus-within:text-primary",
                        inputWrapper:
                            "bg-transparent border data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent rounded-[8px] px-[18px] h-[50px] transition-all duration-150",
                        input:
                            "text-sm text-primary placeholder:text-tertiary bg-transparent font-normal h-full",
                        helperWrapper: "px-1 pt-1.5",
                        description: "text-[11px] text-zinc-400",
                        errorMessage: "text-[11px] font-medium text-error",
                    }}
                />

                <PrimaryInput
                    label="Daily Required (minutes)"
                    type="number"
                    inputType="secondary"
                    placeholder="60"
                    min={0}
                    value={String(form.requiredDailyMinutes)}
                    onChange={(e) =>
                        onChange("requiredDailyMinutes", Number(e.target.value) || 0)
                    }
                />

                <PrimaryInput
                    label="Set Point"
                    type="number"
                    inputType="secondary"
                    placeholder="100"
                    min={0}
                    value={String(form.maxScore)}
                    onChange={(e) => onChange("maxScore", Number(e.target.value) || 0)}
                />

                <PrimarySelect
                    label="Select Topic"
                    selectType="secondary"
                    placeholder="Select Topic"
                    selectedKeys={form.subjectId ? [form.subjectId] : []}
                    onSelectionChange={(keys) =>
                        onChange("subjectId", Array.from(keys)[0] as string)
                    }
                >
                    {subjects.map((subject) => (
                        <SelectItem key={subject.subjectId}>{subject.subjectName}</SelectItem>
                    ))}
                </PrimarySelect>
            </div>

            {/* Classrooms */}
            <div className="flex gap-2">
                <Checkbox
                    isSelected={allSelected}
                    onValueChange={(checked) => {
                        onChange(
                            "classroomIds",
                            checked ? taughtClassrooms.map((c) => c.classroomId) : []
                        );
                    }}
                >
                    All Classrooms
                </Checkbox>

                <CheckboxGroup
                    value={selectedClassroomIds}
                    onValueChange={(value) => onChange("classroomIds", value as string[])}
                >
                    {taughtClassrooms.map((classroom) => (
                        <Checkbox key={classroom.classroomId} value={classroom.classroomId}>
                            {classroom.classroomAbbre}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            </div>

            {/* Grading Rubric */}
            <div className="flex flex-col gap-2">
                <PrimaryInput
                    label="Grading Rubric"
                    type="text"
                    inputType="secondary"
                    placeholder="Web:30;Java:30"
                    value={rubricInput}
                    onChange={(e) => setRubricInput(e.target.value)}
                    onKeyDown={handleRubricKeyDown}
                    description="Format: Label:Score;Label:Score — press Enter to add"
                />

                {rubricBadges.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 px-1">
                        {rubricBadges.map((badge, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center justify-between gap-2 px-3 py-1 rounded-[6px] bg-input-field text-sm font-medium min-w-0"
                            >
                                <span className="truncate min-w-0 flex-1">{badge.label}</span>
                                <span className="text-menta font-medium bg-light-lavendar shrink-0 px-1 rounded">
                                    {badge.score} pts
                                </span>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Attachments */}
            <div className="flex flex-col gap-2">
                {/* Label + trigger */}
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-label text-sm">Attachments</span>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-75 transition-opacity"
                    >
                        <Paperclip size={13} />
                        Add files
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {existingResources.map((resource) => {
                        const name = getFileNameFromResource(resource);
                        const colors = getFileColor(name);

                        return (
                            <a
                                key={resource.assessmentResourceId ?? resource.resourceUrl}
                                href={resource.resourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex w-[190px] shrink-0 items-center gap-3 rounded-[8px] border px-3 py-2"
                            >
                                <div className={`${colors.bgColor} rounded-full p-2`}>
                                    <span className="shrink-0 text-primary">
                                        {getFileIcon(name, colors.iconColor)}
                                    </span>
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="truncate text-xs font-medium leading-tight text-primary">
                                        {name}
                                    </span>
                                    <span className="text-[10px] leading-tight text-tertiary">
                                        {formatResourceSize(resource.fileSize)}
                                    </span>
                                </div>
                            </a>
                        );
                    })}

                    {attachments.map((att) => (
                        <AttachmentCard
                            key={att.id}
                            attachment={att}
                            onRemove={removeAttachment}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
