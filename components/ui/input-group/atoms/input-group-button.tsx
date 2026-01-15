"use client";

import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    defaultVariants: {
      size: "xs",
    },
    variants: {
      size: {
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
      },
    },
  }
);

export type InputGroupButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "href" | "onMouseEnter" | "onTouchStart" | "size"
> &
  VariantProps<typeof inputGroupButtonVariants>;

export function InputGroupButton({
  className,
  size = "xs",
  type = "button",
  variant = "ghost",
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      className={cn(inputGroupButtonVariants({ size }), className)}
      data-size={size}
      type={type}
      variant={variant}
      {...props}
    />
  );
}
