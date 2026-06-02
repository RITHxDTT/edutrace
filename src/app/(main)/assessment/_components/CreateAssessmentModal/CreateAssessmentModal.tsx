"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useState } from "react";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { SubjectType } from "@/types/subject";
import { useCreateAssessment } from "./useCreateAssessmentForm";
import StepTitle from "./steps/StepTitle";
import { Edit } from "iconsax-react";
import StepAssessment from "./steps/StepAssessment";
import { ClassroomProps } from "@/types/classroom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectType[];
  taughtSubjects?: string[];
  taughtClassrooms?: ClassroomProps[];
};

const STEPS = ["Basic Info", "Schedule", "Details"];

export default function CreateAssessmentModal({
  isOpen,
  onClose,
  subjects,
  taughtSubjects,
  taughtClassrooms,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const { form, handleChange, submit, loading, error } =
    useCreateAssessment(onClose);

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    await submit();
    setCurrentStep(0);
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
              <span>Create Assessment</span>
              <span className="text-[14px] text-border-focus">Fill in the details to create a new assessment</span>
            </div>
          </div>

        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          {currentStep === 0 && (
            <StepTitle form={form} onChange={handleChange} />
          )}

          {currentStep === 1 &&
            <StepAssessment form={form} onChange={handleChange} taughtSubjects={taughtSubjects} taughtClassrooms={taughtClassrooms}/>
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
          <PrimaryButton size="md" onClick={isLast ? handleSubmit : handleNext}>
            {isLast ? "Create" : "Next"}
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
