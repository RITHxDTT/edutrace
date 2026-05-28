import { cn } from "@/lib/utils";
import { Button } from "@base-ui/react";
import { cva, VariantProps } from "class-variance-authority";
import { Icon } from "iconsax-react";

const buttonVariants = cva(
  "group/button flex items-center justify-center rounded-[8px] text-white gap-[8px]",
  {
    variants: {
      variant: {
        default: "bg-linear-purple hover:bg-none hover:bg-[#473FCE] hover:cursor-pointer active:bg-none active:bg-[#3F38B7]",
        secondary: "border-2 border text-primary hover:cursor-pointer",
        "borderd-main": "border-1 border-linear-main text-linear-main hover:bg-linear-main hover:text-white hover:cursor-pointer",
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
    icon?: Icon;
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
  // Scale icon size down if the button is extra small
  const iconSize = size === "xs" ? 14 : 16;

  return (
    <Button
      className={cn(buttonVariants({ variant, size }), className)}
     { ...props}
    >
      {iconPosition === "left" && Icon && (
        <Icon color={variant === "secondary" ? "black" : "white"} size={iconSize} />
      )}

      {children}

      {iconPosition === "right" && Icon && (
        <Icon color={variant === "secondary" ? "black" : "white"} size={iconSize} />
      )}
    </Button>
  );
}

export { PrimaryButton, buttonVariants };
