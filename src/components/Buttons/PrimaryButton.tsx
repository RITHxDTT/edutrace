import { cn } from "@/lib/utils";
import { Button } from "@base-ui/react";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const buttonVariants = cva(
  "group/button flex items-center justify-center rounded-[8px] text-white gap-[8px]",
  {
    variants: {
      variant: {
        default: "bg-linear-purple hover:bg-none hover:bg-[#473FCE] hover:cursor-pointer active:bg-none active:bg-[#3F38B7]",
        disable: "border-2 border-[#5D53F9] text-primary",
      },
      size: {
        xs: "px-[12px] py-[6px]",
        sm: "px-[16px] py-[8px]",
        md: "px-[24px] py-[12px]",
        lg: "px-[32px] py-[20px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xs",
    },
  },
);

type PrimaryButtonProps = React.ComponentProps<typeof Button> &
  VariantProps<typeof buttonVariants> & {
    iconPosition?: "right" | "left" | "none";
    icon?: LucideIcon;
  };

function PrimaryButton({
  className,
  variant = "default",
  size = "xs",
  iconPosition = "none",
  icon: Icon,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {iconPosition === "left" && Icon && <Icon color="white" size={20} />}
      {children}
      {iconPosition === "right" && Icon && <Icon color="white" size={20} />}
    </Button>
  );
}

export { PrimaryButton, buttonVariants };
