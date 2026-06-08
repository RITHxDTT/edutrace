"use client"

import PrimaryInput from "@/components/Inputs/PrimaryInputField";
import PrimarySelect from "@/components/Selects/PrimarySelect";
import { AssessmentResource, CreateAssessmentForm } from "@/types/assessment";
import { ClassroomType } from "@/types/classroom";
import { SubjectType } from "@/types/subject";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { DatePicker, DateRangePicker } from "@heroui/date-picker";
import { SelectItem } from "@heroui/select";
import { useState, KeyboardEvent, useRef } from "react";
import { Link, Paperclip, X } from "lucide-react";
import AttachmentCard from "./_components/FileCard";
import { formatFileSize, getFileColor, getFileIcon, getResourceFileName } from "@/utils/fileUtils";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { CreateAssessmentFormErrors } from "../useCreateAssessmentForm";

type Props = {
    form: CreateAssessmentForm;
    errors: CreateAssessmentFormErrors;
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


function getDateOnlyValue(value: string) {
    return parseDate(getLocalDateValue(value));
}

function padTimePart(value: number) {
    return String(value).padStart(2, "0");
}

function getLocalDateValue(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return [
        date.getFullYear(),
        padTimePart(date.getMonth() + 1),
        padTimePart(date.getDate()),
    ].join("-");
}

function getLocalTimeValue(value: string, fallback: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;

    return `${padTimePart(date.getHours())}:${padTimePart(date.getMinutes())}`;
}

function formatDateDisplay(isoString: string) {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function combineDateAndTime(dateValue: string, timeValue: string) {
    if (!dateValue) return "";

    return new Date(`${dateValue}T${timeValue || "00:00"}:00`).toISOString();
}

export default function StepAssessment({
    form,
    errors,
    onChange,
    subjects,
    taughtClassrooms,
    existingResources = [],
    mode = "create",
}: Props) {
    const selectedClassroomIds = form.classroomIds;
    const allSelected =
        taughtClassrooms.length > 0 && selectedClassroomIds.length === taughtClassrooms.length;

    const [rubricInput, setRubricInput] = useState(form.gradingRubric);
    const [rubricBadges, setRubricBadges] = useState<RubricBadge[]>(
        () => parseRubricInput(form.gradingRubric),
    );
    const [rubricError, setRubricError] = useState("");
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const [linkInput, setLinkInput] = useState("");
    const [linkError, setLinkError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRubricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRubricInput(e.target.value);
        if (rubricError) setRubricError("");
    };

    const validateRubric = (parsed: RubricBadge[]): string => {
        const total = parsed.reduce((sum, b) => sum + b.score, 0);
        if (total > 100) return `Rubric total is ${total} pts — must not exceed 100.`;
        return "";
    };

    const handleRubricBlur = () => {
        const value = rubricInput.trim();
        if (!value) { setRubricError(""); return; }
        const parsed = parseRubricInput(value);
        if (parsed.length === 0) {
            setRubricError("Invalid format. Use Label:Score;Label:Score (e.g. Web:30;Java:30)");
        } else {
            const err = validateRubric(parsed);
            if (err) {
                setRubricError(err);
            } else if (value !== form.gradingRubric.trim()) {
                setRubricError("Press Enter to confirm your rubric entries");
            } else {
                setRubricError("");
            }
        }
    };

    const handleRubricKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const parsed = parseRubricInput(rubricInput);
            if (parsed.length > 0) {
                const err = validateRubric(parsed);
                if (err) {
                    setRubricError(err);
                } else {
                    setRubricBadges(parsed);
                    onChange("gradingRubric", rubricInput);
                    setRubricError("");
                }
            } else if (rubricInput.trim()) {
                setRubricError("Invalid format. Use Label:Score;Label:Score (e.g. Web:30;Java:30)");
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

    const addResourceLink = () => {
        const trimmed = linkInput.trim();
        if (!trimmed) return;
        try {
            new URL(trimmed);
        } catch {
            setLinkError("Please enter a valid URL (e.g. https://example.com)");
            return;
        }
        if (form.resourceLink.includes(trimmed)) {
            setLinkError("This link has already been added.");
            return;
        }
        onChange("resourceLink", [...form.resourceLink, trimmed]);
        setLinkInput("");
        setLinkError("");
    };

    const removeResourceLink = (url: string) => {
        onChange("resourceLink", form.resourceLink.filter((l) => l !== url));
    };

    const handleLinkKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addResourceLink();
        }
    };

    const isScheduled = !!form.startAt && new Date(form.startAt) > new Date();

    return (
        <>
            {isScheduled && (
                <div className="rounded-[10px] bg-accent-sand px-4 py-3 text-sm font-medium text-[#DEA20A]">
                    This assessment is scheduled for a future date. Students will not see it or receive notifications until the start date.
                </div>
            )}


            <div className="w-full grid grid-cols-2 gap-2">
                {mode === "edit" ? (
                    <>
                        <PrimaryInput
                            label="Start Date"
                            type="text"
                            inputType="secondary"
                            value={formatDateDisplay(form.startAt)}
                            isDisabled
                        />
                        <DatePicker
                            label="Due Date"
                            labelPlacement="outside-top"
                            value={form.dueAt ? getDateOnlyValue(form.dueAt) : null}
                            isInvalid={!!errors.dueAt}
                            errorMessage={errors.dueAt}
                            onChange={(date) => {
                                if (!date) return;
                                const dueTime = getLocalTimeValue(form.dueAt, "23:59");
                                onChange("dueAt", combineDateAndTime(date.toString(), dueTime));
                            }}
                            classNames={{
                                base: "font-sans",
                                label: "font-semibold text-label mb-1.5 transition-colors duration-150 group-focus-within:text-primary",
                                inputWrapper: "bg-transparent border data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent rounded-[8px] px-[18px] h-[50px] transition-all duration-150",
                                input: "text-sm text-primary placeholder:text-tertiary bg-transparent font-normal h-full",
                                errorMessage: "text-[11px] font-medium text-error",
                            }}
                        />
                    </>
                ) : (
                    <DateRangePicker
                        hideTimeZone
                        className="col-span-2 w-full"
                        label="Assessment Date"
                        labelPlacement="outside-top"
                        minValue={today(getLocalTimeZone())}
                        value={
                            form.startAt && form.dueAt
                                ? {
                                    start: getDateOnlyValue(form.startAt),
                                    end: getDateOnlyValue(form.dueAt),
                                }
                                : null
                        }
                        isInvalid={!!errors.startAt || !!errors.dueAt}
                        errorMessage={errors.startAt ?? errors.dueAt}
                        onChange={(range) => {
                            const startTime = getLocalTimeValue(form.startAt, "00:00");
                            const dueTime = getLocalTimeValue(form.dueAt, "23:59");

                            onChange(
                                "startAt",
                                range?.start
                                    ? combineDateAndTime(range.start.toString(), startTime)
                                    : "",
                            );
                            onChange(
                                "dueAt",
                                range?.end
                                    ? combineDateAndTime(range.end.toString(), dueTime)
                                    : "",
                            );
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
                )}

                <PrimaryInput
                    label="Start Time"
                    type="time"
                    inputType="secondary"
                    value={getLocalTimeValue(form.startAt, "00:00")}
                    isDisabled={!form.startAt || mode === "edit"}
                    isInvalid={!!errors.startAt}
                    errorMessage={errors.startAt}
                    onChange={(e) =>
                        onChange(
                            "startAt",
                            combineDateAndTime(getLocalDateValue(form.startAt), e.target.value),
                        )
                    }
                />

                <PrimaryInput
                    label="Due Time"
                    type="time"
                    inputType="secondary"
                    value={getLocalTimeValue(form.dueAt, "23:59")}
                    isDisabled={!form.dueAt}
                    isInvalid={!!errors.dueAt}
                    errorMessage={errors.dueAt}
                    onChange={(e) =>
                        onChange(
                            "dueAt",
                            combineDateAndTime(getLocalDateValue(form.dueAt), e.target.value),
                        )
                    }
                />

                <PrimaryInput
                    label="Daily Required (minutes)"
                    type="number"
                    inputType="secondary"
                    placeholder="60"
                    min={0}
                    value={String(form.requiredDailyMinutes)}
                    isInvalid={!!errors.requiredDailyMinutes}
                    errorMessage={errors.requiredDailyMinutes}
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
                    isInvalid={!!errors.maxScore}
                    errorMessage={errors.maxScore}
                    onChange={(e) => onChange("maxScore", Number(e.target.value) || 0)}
                />

                <PrimarySelect
                    label="Select Topic"
                    selectType="secondary"
                    placeholder="Select Topic"
                    selectedKeys={form.subjectId ? [form.subjectId] : []}
                    isInvalid={!!errors.subjectId}
                    errorMessage={errors.subjectId}
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
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-label">Classrooms</p>

                <Checkbox
                    isSelected={allSelected}
                    isIndeterminate={selectedClassroomIds.length > 0 && !allSelected}
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
                    classNames={{ wrapper: "flex flex-wrap gap-x-6 gap-y-1" }}
                >
                    {taughtClassrooms.map((classroom) => (
                        <Checkbox key={classroom.classroomId} value={classroom.classroomId}>
                            {classroom.classroomAbbre}
                        </Checkbox>
                    ))}
                </CheckboxGroup>

                {errors.classroomIds && (
                    <p className="px-1 text-[11px] font-medium text-error">
                        {errors.classroomIds}
                    </p>
                )}
            </div>

            {/* Grading Rubric */}
            <div className="flex flex-col gap-2">
                <PrimaryInput
                    label="Grading Rubric"
                    type="text"
                    inputType="secondary"
                    placeholder="Web:30;Java:30"
                    value={rubricInput}
                    onChange={handleRubricChange}
                    onBlur={handleRubricBlur}
                    onKeyDown={handleRubricKeyDown}
                    isInvalid={!!rubricError}
                    errorMessage={rubricError}
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
                        const name = getResourceFileName(resource);
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
                                        {formatFileSize(resource.fileSize)}
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

            {/* Resource Links */}
            <div className="flex flex-col gap-2">
                <span className="font-semibold text-label text-sm">Resource Links</span>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <PrimaryInput
                            label=""
                            type="url"
                            inputType="secondary"
                            placeholder="https://example.com"
                            value={linkInput}
                            isInvalid={!!linkError}
                            errorMessage={linkError}
                            onChange={(e) => {
                                setLinkInput(e.target.value);
                                if (linkError) setLinkError("");
                            }}
                            onKeyDown={handleLinkKeyDown}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={addResourceLink}
                        className="inline-flex items-center gap-1.5 shrink-0 text-xs font-medium text-primary hover:opacity-75 transition-opacity mt-1"
                    >
                        <Link size={13} />
                        Add
                    </button>
                </div>

                {form.resourceLink.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        {form.resourceLink.map((url) => (
                            <div
                                key={url}
                                className="flex items-center gap-2 rounded-[8px] bg-input-field px-3 py-2"
                            >
                                <Link size={12} className="shrink-0 text-primary" />
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 truncate text-xs font-medium text-primary hover:underline min-w-0"
                                >
                                    {url}
                                </a>
                                <button
                                    type="button"
                                    onClick={() => removeResourceLink(url)}
                                    className="shrink-0 text-tertiary hover:text-red transition-colors"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
