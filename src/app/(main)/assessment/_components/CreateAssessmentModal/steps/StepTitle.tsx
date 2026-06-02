import { Textarea } from "@heroui/input";
import { CreateAssessmentForm } from "@/types/assessment";
import PrimaryInput from "@/components/Inputs/PrimaryInputField";
import RichTextEditor from "@/components/RIchTextEditor/TipTap";

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

      <RichTextEditor />
    </>
  );
}
