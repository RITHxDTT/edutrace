import { cn } from "@/lib/utils";
import { Button } from "@base-ui/react";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "",
    },
    size: {
      default: "px-2 py-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type PrimaryButtonProps = React.ComponentProps<typeof Button> &
  VariantProps<typeof buttonVariants>;

function PrimaryButton({
  className,
  variant = "default",
  size = "default",
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { PrimaryButton, buttonVariants };
