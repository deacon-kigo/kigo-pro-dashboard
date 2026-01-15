import type { VariantProps } from "class-variance-authority";

import type { ComponentProps } from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:focus-visible:relative [&>*]:focus-visible:z-10",
  {
    defaultVariants: {
      orientation: "horizontal",
    },
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
  }
);

export interface ButtonGroupProps
  extends ComponentProps<"div">, VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = ({
  className,
  orientation,
  ...props
}: ButtonGroupProps) => (
  <div
    className={cn(buttonGroupVariants({ orientation }), className)}
    data-orientation={orientation}
    data-slot="button-group"
    data-testid="button-group"
    role="group"
    {...props}
  />
);

export { ButtonGroup, buttonGroupVariants };
