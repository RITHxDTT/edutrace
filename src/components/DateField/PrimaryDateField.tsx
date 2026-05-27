import { tv, VariantProps } from "tailwind-variants";
import { DateInput, DateInputProps } from "@heroui/date-input";
import { DateValue} from "@internationalized/date";

type PrimaryDateInputProps = Omit<DateInputProps, "value"> &
    VariantProps<typeof inputVariants> & {
        inputType?: "primary" | "secondary";
        label: string;
        description?: string;
        labelPlacement?: "inside" | "outside" | "outside-left" | "outside-top";
        errorMessage?: string;
        isInvalid?: boolean;
        value: DateValue | null;
        onChange: (value: DateValue | null) => void;
    };

const inputVariants = tv({
    slots: {
        base: "w-full group",
        label: "",
        innerWrapper: "",
        inputWrapper: "",
        segment: "",
        helperWrapper: "px-1 pt-1",
        description: "",
        errorMessage: "text-xs font-medium",
    },
    variants: {
        inputType: {
            primary: {
                base: "font-sans",
                label: "font-semibold text-label mb-1 transition-colors duration-150 group-focus-within:text-primary",
                inputWrapper:
                    "bg-input-field border border-transparent data-[focus=true]:border-primary/20 data-[focus=true]:bg-input-field data-[hover=true]:border-primary/20 data-[hover=true]:bg-input-field rounded-[8px] px-[18px] h-[50px] transition-all duration-150",
                segment:
                    "text-sm text-primary placeholder:text-tertiary font-normal",
                helperWrapper: "px-1 pt-1.5",
                description: "text-[11px] text-zinc-400",
                errorMessage: "text-[11px] font-medium text-rose-500",
                selectorButton: "text-primary mr-2",
            },
            secondary: {
                base: "font-sans",
                label: "",
                innerWrapper: "",
                inputWrapper: "",
                segment: "",
                helperWrapper: "",
                description: "",
                errorMessage: "",
                selectorButton: "",
            },
        },
    },
    defaultVariants: {
        inputType: "primary",
    },
});

export default function PrimaryDateInput({
    label,
    description,
    labelPlacement,
    className,
    inputType = "primary",
    isInvalid,
    errorMessage,
    value,
    onChange,
    ...props
}: PrimaryDateInputProps) {
    const slots = inputVariants({ inputType });


    return (
        <DateInput
            label={label}
            classNames={{
                base: slots.base({ class: className }),
                label: slots.label(),
                innerWrapper: slots.innerWrapper(),
                inputWrapper: slots.inputWrapper(),
                segment: slots.segment(),
                helperWrapper: slots.helperWrapper(),
                description: slots.description(),
                errorMessage: slots.errorMessage(),
            }}
            description={description}
            labelPlacement={labelPlacement ?? "outside-top"}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
}

export { PrimaryDateInput };