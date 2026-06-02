"use client"

import PrimaryInput from "@/components/Inputs/PrimaryInputField";
import PrimarySelect from "@/components/Selects/PrimarySelect";
import { CreateAssessmentForm } from "@/types/assessment";
import { ClassroomType } from "@/types/classroom";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { DateRangePicker } from "@heroui/date-picker";
import { SelectItem } from "@heroui/select";
import { useState, KeyboardEvent, useRef } from "react";
import { X, Paperclip, FileText, Image, File } from "lucide-react";
import AttachmentCard from "./_components/FileCard";

type Props = {
    form: CreateAssessmentForm;
    onChange: <K extends keyof CreateAssessmentForm>(
        key: K,
        value: CreateAssessmentForm[K],
    ) => void;
    taughtSubjects: string[];
    taughtClassrooms: ClassroomType[];
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

function getFileIcon(name: string) {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? ""))
        return <Image size={14} />;
    if (["pdf", "doc", "docx", "txt"].includes(ext ?? ""))
        return <FileText size={14} />;
    return <File size={14} />;
}

export default function StepAssessment({ form, onChange, taughtSubjects, taughtClassrooms }: Props) {
    const allSelected = form.classroomIds.length === taughtClassrooms.length;

    const [rubricInput, setRubricInput] = useState("");
    const [rubricBadges, setRubricBadges] = useState<RubricBadge[]>([]);
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRubricKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const parsed = parseRubricInput(rubricInput);
            if (parsed.length > 0) {
                setRubricBadges(parsed);
                onChange("gradingRubric" as keyof CreateAssessmentForm, rubricInput as any);
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
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeAttachment = (id: string) => {
        setAttachments((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <>
            <div className="w-full grid grid-cols-2 gap-2">
                <DateRangePicker
                    className="w-full"
                    label="Assessment Date"
                    labelPlacement="outside-top"
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
                    type="text"
                    inputType="secondary"
                    placeholder="60"
                />

                <PrimaryInput
                    label="Set Point"
                    type="text"
                    inputType="secondary"
                    placeholder="100"
                />

                <PrimarySelect label="Select Topic" selectType="secondary" placeholder="Select Topic">
                    {taughtSubjects.map((subject, index) => (
                        <SelectItem key={index}>{subject}</SelectItem>
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
                    value={form.classroomIds}
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