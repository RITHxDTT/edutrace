"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { SubjectType } from "@/types/subject";
import { useCreateAssessment } from "./useCreateAssessmentForm";
import StepTitle from "./steps/StepTitle";
import { Edit } from "iconsax-react";
import StepAssessment from "./steps/StepAssessment";
import { ClassroomType } from "@/types/classroom";
import { AssessmentType } from "@/types/assessment";
import { useSession } from "next-auth/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectType[];
  taughtClassrooms: ClassroomType[];
  assessment?: AssessmentType;
  assessmentId?: string;
  mode?: "create" | "edit";
};

const STEPS = ["Basic Info", "Assessment Details"];

type SessionSubject = SubjectType | string;

function getStringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getRecordValue(value: unknown, key: string) {
  if (!value || typeof value !== "object") return undefined;

  return (value as Record<string, unknown>)[key];
}

function normalizeSubjects(
  taughtSubjects: SessionSubject[] | undefined,
  fallbackSubjects: SubjectType[],
) {
  if (!taughtSubjects?.length) return fallbackSubjects;

  return taughtSubjects.map((subject) => {
    if (typeof subject !== "string") return subject;

    const matchedSubject = fallbackSubjects.find(
      (item) => item.subjectId === subject || item.subjectName === subject,
    );

    return (
      matchedSubject ?? {
        subjectId: subject,
        subjectName: subject,
      }
    );
  });
}

function getClassroomLabel(value: unknown, fallback: string) {
  return (
    getStringValue(getRecordValue(value, "classroomAbbre")) ??
    getStringValue(getRecordValue(value, "className")) ??
    getStringValue(getRecordValue(value, "classroomName")) ??
    getStringValue(getRecordValue(getRecordValue(value, "classroom"), "classroomAbbre")) ??
    getStringValue(getRecordValue(getRecordValue(value, "classroom"), "className")) ??
    fallback
  );
}

function getAssessmentClassroomOptions(
  assessment: AssessmentType | undefined,
  taughtClassrooms: ClassroomType[],
) {
  const classroomMap = new Map<string, ClassroomType>();

  taughtClassrooms.forEach((classroom) => {
    classroomMap.set(classroom.classroomId, classroom);
  });

  const assessmentClassrooms = assessment?.classrooms ?? assessment?.classroomIds ?? [];

  assessmentClassrooms.forEach((classroom) => {
    const nestedClassroom = getRecordValue(classroom, "classroom");
    const candidates = [
      getStringValue(classroom),
      getStringValue(getRecordValue(classroom, "classroomId")),
      getStringValue(getRecordValue(classroom, "id")),
      getStringValue(getRecordValue(classroom, "classId")),
      getStringValue(getRecordValue(nestedClassroom, "classroomId")),
      getStringValue(getRecordValue(nestedClassroom, "id")),
      getStringValue(getRecordValue(classroom, "classroomAbbre")),
      getStringValue(getRecordValue(classroom, "className")),
      getStringValue(getRecordValue(classroom, "classroomName")),
    ].filter(Boolean);

    const matchedClassroom = taughtClassrooms.find((item) =>
      candidates.some(
        (candidate) =>
          candidate === item.classroomId ||
          candidate === item.classroomAbbre ||
          candidate === item.className,
      ),
    );
    const classroomId = matchedClassroom?.classroomId ?? candidates[0];

    if (!classroomId || classroomMap.has(classroomId)) return;

    classroomMap.set(classroomId, {
      classroomId,
      className: getClassroomLabel(classroom, classroomId),
      classroomAbbre: getClassroomLabel(classroom, classroomId),
    });
  });

  return Array.from(classroomMap.values());
}

export default function CreateAssessmentModal({
  isOpen,
  onClose,
  subjects,
  taughtClassrooms,
  assessment,
  assessmentId,
  mode = "create",
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();
  const classroomOptions = useMemo(
    () => getAssessmentClassroomOptions(assessment, taughtClassrooms),
    [assessment, taughtClassrooms],
  );
  const { form, errors, handleChange, submit, reset, loading, error } =
    useCreateAssessment({
      assessment,
      assessmentId,
      taughtClassrooms: classroomOptions,
      mode,
      onSuccess: onClose,
    });
  const taughtSubjects = useMemo(
    () => normalizeSubjects(session?.user?.taughtSubjects, subjects),
    [session?.user?.taughtSubjects, subjects],
  );

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;
  const isEdit = mode === "edit";

  const handleClose = () => {
    setCurrentStep(0);
    reset();
    onClose();
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const success = await submit();
    if (!success) return;

    setCurrentStep(0);
    router.refresh();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-light-blue p-3 rounded-[20px]">
              <Edit size={32} color="#20AEE6" />
            </div>
            <div className="flex flex-col">
              <span>{isEdit ? "Edit Assessment" : "Create Assessment"}</span>
              <span className="text-[14px] text-border-focus">
                {isEdit
                  ? "Update the details for this assessment"
                  : "Fill in the details to create a new assessment"}
              </span>
            </div>
          </div>

        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          {currentStep === 0 && (
            <StepTitle form={form} errors={errors} onChange={handleChange} />
          )}

          {currentStep === 1 &&
            <StepAssessment
              form={form}
              errors={errors}
              onChange={handleChange}
              subjects={taughtSubjects}
              taughtClassrooms={classroomOptions}
              existingResources={assessment?.resources ?? []}
            />
          }
        </ModalBody>

        <ModalFooter>
          <PrimaryButton
            variant="secondary"
            size="md"
            onClick={isFirst ? handleClose : handleBack}
          >
            {isFirst ? "Cancel" : "Back"}
          </PrimaryButton>
          <PrimaryButton
            size="md"
            onClick={isLast ? handleSubmit : handleNext}
            disabled={loading}
          >
            {isLast
              ? loading
                ? isEdit ? "Updating..." : "Creating..."
                : isEdit ? "Update" : "Create"
              : "Next"}
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
