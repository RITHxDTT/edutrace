import { tv, VariantProps } from "tailwind-variants";
import { Select, SelectItem, SelectSection } from '@heroui/select';
import { Icon } from "iconsax-react";

export type SelectOption = {
    key: string;
    label: string;
}

export type SelectSectionGroup = {
    title: string;
    options: SelectOption[];
}

type SelectProps = React.ComponentProps<typeof Select> &
    VariantProps<typeof selectVariants> & {
        selectType?: "primary" | "secondary"
        iconPosition?: "right" | "left" | "none";
        label: string;
        description?: string;
        labelPlacement?: "inside" | "outside" | "outside-left" | "outside-top";
        icon?: Icon;
        onIconClick?: () => void;
        options?: SelectOption[];
        sections?: SelectSectionGroup[];
    }

const selectVariants = tv({
    slots: {
        base: "w-full group",
        label: "",
        mainWrapper: "w-full",
        innerWrapper: "",
        listboxWrapper: "",
        listbox: "",
        clearButton: "",
        helperWrapper: "px-1 pt-1",
        description: "",
        errorMessage: "text-xs font-medium",
        trigger: "",
        value: "",
        selectorIcon: "",
        popoverContent: "",
    },

    variants: {
        selectType: {
            primary: {
                base: "font-sans",
                label: "font-semibold text-label mb-1 transition-colors duration-150 group-focus-within:text-primary",
                mainWrapper: "w-full",
                innerWrapper: "",
                trigger:
                    "bg-input-field border border-transparent data-[focus=true]:border-primary/20 data-[focus=true]:bg-input-field data-[hover=true]:border-primary/20 data-[hover=true]:bg-input-field rounded-[8px] px-[27px] h-[60px] transition-all duration-150",
                value:
                    "text-sm text-primary placeholder:text-tertiary bg-transparent font-normal h-full",
                clearButton: "text-zinc-400 hover:text-zinc-600",
                helperWrapper: "px-1 pt-1.5",
                description: "text-[11px] text-zinc-400",
                errorMessage: "text-[11px] font-medium text-rose-500",
                selectorIcon: "text-tertiary",
                popoverContent: "rounded-[8px] bg-input-field",
                listbox: "p-1",
            },

            secondary: {
                base: "font-sans",
                label: "",
                mainWrapper: "",
                trigger: "",
                value: "",
                clearButton: "",
                helperWrapper: "",
                description: "",
                errorMessage: "",
                selectorIcon: "",
                popoverContent: "",
                listbox: "",
            },
        },
    },
    defaultVariants: {
        selectType: "primary",
    },
});

export default function PrimarySelect({
    label,
    description,
    labelPlacement,
    className,
    selectType = "primary",
    iconPosition = "none",
    icon: IconComponent,
    onIconClick,
    options,
    sections,
    ...props
}: SelectProps) {
    const slots = selectVariants({ selectType });

    return (
        <Select
            label={label}
            classNames={{
                base: slots.base({ class: className }),
                label: slots.label(),
                mainWrapper: slots.mainWrapper(),
                innerWrapper: slots.innerWrapper(),
                listboxWrapper: slots.listboxWrapper(),
                listbox: slots.listbox(),
                clearButton: slots.clearButton(),
                helperWrapper: slots.helperWrapper(),
                description: slots.description(),
                errorMessage: slots.errorMessage(),
                trigger: slots.trigger(),
                value: slots.value(),
                selectorIcon: slots.selectorIcon(),
                popoverContent: slots.popoverContent(),
            }}
            description={description}
            labelPlacement={labelPlacement ?? "outside-top"}
            endContent={
                iconPosition === "right" && IconComponent ? (
                    <button
                        type="button"
                        onClick={onIconClick}
                        className="cursor-pointer outline-none"
                    >
                        <IconComponent
                            color={selectType === "secondary" ? "white" : "black"}
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
                        className="cursor-pointer outline-none"
                    >
                        <IconComponent
                            color={selectType === "secondary" ? "white" : "black"}
                            size={20}
                        />
                    </button>
                ) : null
            }
            {...props}
        />
    );
}

export { PrimarySelect };