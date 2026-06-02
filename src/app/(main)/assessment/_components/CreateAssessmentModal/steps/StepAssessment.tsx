import PrimaryInput from "@/components/Inputs/PrimaryInputField";
import { CreateAssessmentForm } from "@/types/assessment";
import { DateRangePicker } from "@heroui/date-picker";

type Props = {
    form: CreateAssessmentForm;
    onChange: <K extends keyof CreateAssessmentForm>(
        key: K,
        value: CreateAssessmentForm[K],
    ) => void;
};

export default function StepAssessment({ form, onChange }: Props) {

    return (
        <>
            <div className="w-full grid grid-cols-2 gap-2">
                <DateRangePicker className={"w-full"} label="Assessment Date" labelPlacement="outside-top" classNames={{
                    base: "font-sans",
                    label: "font-semibold text-label mb-1.5 transition-colors duration-150 group-focus-within:text-primary",
                    innerWrapper: "",
                    inputWrapper:
                        "bg-transparent border data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent rounded-[8px] px-[18px] h-[50px] transition-all duration-150",
                    input:
                        "text-sm text-primary placeholder:text-tertiary bg-transparent font-normal h-full",
                    helperWrapper: "px-1 pt-1.5",
                    description: "text-[11px] text-zinc-400",
                    errorMessage: "text-[11px] font-medium text-error",
                }} />

                <div >
                    <PrimaryInput
                        label="Daily Required (minutes)"
                        type="text"
                        inputType="secondary"
                        placeholder="60"
                    />
                </div>
            </div>
        </>
    );
}
