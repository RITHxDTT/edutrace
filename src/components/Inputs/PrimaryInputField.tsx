import { tv, VariantProps } from "tailwind-variants";
import { Input } from '@heroui/input';
import { Icon } from "iconsax-react";

type InputProps = React.ComponentProps<typeof Input> &
    VariantProps<typeof inputVariants> & {
        inputType?: "primary" | "secondary"
        iconPosition?: "right" | "left" | "none";
        label: string;
        description?: string;
        labelPlacement?: "inside" | "outside" | "outside-left" | "outside-top";
        type: string;
        icon?: Icon;
        onIconClick?: () => void
    }

const inputVariants = tv({
    slots: {
        base: "w-full group",
        label: "",
        mainWrapper: "w-full",
        innerWrapper: "",
        inputWrapper: "",
        input: "",
        clearButton: "",
        helperWrapper: "px-1 pt-1",
        description: "",
        errorMessage: "text-xs font-medium",
    },

    variants: {
        inputType: {
            primary: {
                base: "font-sans",
                label: "font-semibold text-label mb-1 transition-colors duration-150 group-focus-within:text-primary",
                mainWrapper: "w-full",
                innerWrapper: "",
                inputWrapper:
                    "bg-input-field border border-transparent data-[focus=true]:border-primary/20 data-[focus=true]:bg-input-field data-[hover=true]:border-/20 data-[hover=true]:bg-input-field rounded-[8px] px-[18px] h-[50px] transition-all duration-150",
                input:
                    "text-sm text-primary placeholder:text-tertiary bg-transparent font-normal h-full",
                clearButton: "text-zinc-400 hover:text-zinc-600",
                helperWrapper: "px-1 pt-1.5",
                description: "text-[11px] text-zinc-400",
                errorMessage: "text-[11px] font-medium text-error",
            },

            secondary: {
                base: "font-sans",
                label: "font-semibold text-label mb-1 transition-colors duration-150 group-focus-within:text-primary",
                mainWrapper: "w-full",
                innerWrapper: "",
                inputWrapper:
                    "bg-transparent border data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent rounded-[8px] px-[18px] h-[50px] transition-all duration-150",
                input:
                    "text-sm text-primary placeholder:text-tertiary bg-transparent font-normal h-full",
                clearButton: "text-zinc-400 hover:text-zinc-600",
                helperWrapper: "px-1 pt-1.5",
                description: "text-[11px] text-zinc-400",
                errorMessage: "text-[11px] font-medium text-error",
            },
        },
    },
    defaultVariants: {
        inputType: "primary",
    },
});

export default function PrimaryInput({
    label,
    description,
    labelPlacement,
    type,
    className,
    inputType = "primary",
    iconPosition = "none",
    icon: IconComponent,
    onIconClick,
    ...props
}: InputProps) {
    const slots = inputVariants({ inputType });
    const accessibleLabel =
        props["aria-label"] ??
        (label.trim() ? undefined : props.placeholder?.toString() || "Input field");

    return (
        <Input
            label={label}
            aria-label={accessibleLabel}
            classNames={{
                base: slots.base({ class: className }),
                label: slots.label(),
                mainWrapper: slots.mainWrapper(),
                innerWrapper: slots.innerWrapper(),
                inputWrapper: slots.inputWrapper(),
                input: slots.input(),
                clearButton: slots.clearButton(),
                helperWrapper: slots.helperWrapper(),
                description: slots.description(),
                errorMessage: slots.errorMessage(),
            }}
            description={description}
            labelPlacement={labelPlacement ?? "outside-top"}
            type={type}
            endContent={
                iconPosition === "right" && IconComponent ? (
                    <button
                        type="button"
                        onClick={onIconClick}
                        tabIndex={-1}
                        className="outline-none"
                    >
                        <IconComponent
                            color={inputType === "secondary" ? "white" : "black"}
                            size={20}
                        />
                    </button>
                ) : null
            }

            startContent={
                iconPosition === "left" && IconComponent ? (
                    <button
                        type="button"
                        onClick={onIconClick}
                        tabIndex={-1}
                        className="outline-none"
                    >
                        <IconComponent
                            color={inputType === "secondary" ? "white" : "black"}
                            size={20}
                        />
                    </button>
                ) : null
            }
            {...props}
        />
    );
}

export { PrimaryInput };
