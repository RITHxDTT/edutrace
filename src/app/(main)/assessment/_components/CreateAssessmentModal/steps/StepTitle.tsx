import { Textarea } from "@heroui/input";
import { CreateAssessmentForm } from "@/types/assessment";
import PrimaryInput from "@/components/Inputs/PrimaryInputField";

type Props = {
  form: CreateAssessmentForm;
  onChange: <K extends keyof CreateAssessmentForm>(
    key: K,
    value: CreateAssessmentForm[K],
  ) => void;
};

export default function StepTitle({ form, onChange }: Props) {
  return (
    <>
      <PrimaryInput
        label="Title"
        placeholder="Enter title"
        inputType="secondary"
        type="text"
        value={form.title}
        onChange={(e) => onChange("title", e.target.value)}
      />

      <Textarea
        label="Description"
        placeholder="Enter description"
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
      />
    </>
  );
}
