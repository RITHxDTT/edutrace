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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectType[];
};

const STEPS = ["Basic Info", "Schedule", "Details"];

export default function CreateAssessmentModal({
  isOpen,
  onClose,
  subjects,
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
          <div className="flex flex-col">
            <span>Create Assessment</span>
            <span className="text-sm text-icon-seconary">Fill in the details to create a new assessment</span>
          </div>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          {currentStep === 0 && (
            <StepTitle form={form} onChange={handleChange} />
          )}
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
