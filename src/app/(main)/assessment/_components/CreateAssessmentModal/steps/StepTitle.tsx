import { CreateAssessmentForm } from "@/types/assessment";
import PrimaryInput from "@/components/Inputs/PrimaryInputField";
import RichTextEditor from "@/components/RIchTextEditor/TipTap";
import { Switch } from '@heroui/switch';
import PrimarySelect from "@/components/Selects/PrimarySelect";
import { ASSESSMENT_TYPE_LABELS, ASSESSMENT_TYPES, AssessmentType } from "@/app/constants/assessments";
import { SelectItem } from "@heroui/select";
import { CreateAssessmentFormErrors } from "../useCreateAssessmentForm";

type Props = {
  form: CreateAssessmentForm;
  errors: CreateAssessmentFormErrors;
  onChange: <K extends keyof CreateAssessmentForm>(
    key: K,
    value: CreateAssessmentForm[K],
  ) => void;
};

export default function StepTitle({ form, errors, onChange }: Props) {
  
  
  return (
    <>
      <PrimaryInput
        label="Title"
        placeholder="Enter title"
        inputType="secondary"
        type="text"
        value={form.title}
        isInvalid={!!errors.title}
        errorMessage={errors.title}
        onChange={(e) => onChange("title", e.target.value)}
      />

      <Switch
        isSelected={form.allowLateSubmissions}
        onValueChange={(checked) => onChange("allowLateSubmissions", checked)}
        classNames={{
          wrapper: "group-data-[selected=true]:bg-linear-purple group-data-[selected=false]:bg-transparent"
        }}
      >
        Accepting Submission After Deadline?
      </Switch>

      <PrimarySelect
        label="Assessment Type"
        selectedKeys={[form.assessmentType]}
        selectType="secondary"
        isInvalid={!!errors.assessmentType}
        errorMessage={errors.assessmentType}
        onSelectionChange={(keys) =>
          onChange("assessmentType", Array.from(keys)[0] as AssessmentType)
        }
      >
        {ASSESSMENT_TYPES.map((type) => (
          <SelectItem key={type}>
            {ASSESSMENT_TYPE_LABELS[type]}
          </SelectItem>
        ))}
      </PrimarySelect>
      <RichTextEditor
        label="Description (optional)"
        value={form.description}
        onChange={(value) => onChange("description", value)}
      />
    </>
  );
}
