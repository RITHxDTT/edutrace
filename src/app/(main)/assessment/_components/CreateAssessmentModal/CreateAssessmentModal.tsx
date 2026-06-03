"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { SubjectType } from "@/types/subject";
import { useCreateAssessment } from "./useCreateAssessmentForm";
import StepTitle from "./steps/StepTitle";
import { Edit } from "iconsax-react";
import StepAssessment from "./steps/StepAssessment";
import { ClassroomType } from "@/types/classroom";
import { AssessmentType } from "@/types/assessment";

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
  const { form, handleChange, submit, reset, loading, error } =
    useCreateAssessment({
      assessment,
      assessmentId,
      mode,
      onSuccess: onClose,
    });

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
    const classroomFallback =
      isEdit && form.classroomIds.length === 0
        ? { classroomIds: taughtClassrooms.map((classroom) => classroom.classroomId) }
        : undefined;
    const success = await submit(classroomFallback);
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
            <StepTitle form={form} onChange={handleChange} />
          )}

          {currentStep === 1 &&
            <StepAssessment
              form={form}
              onChange={handleChange}
              subjects={subjects}
              taughtClassrooms={taughtClassrooms}
              existingResources={assessment?.resources ?? []}
              mode={mode}
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
