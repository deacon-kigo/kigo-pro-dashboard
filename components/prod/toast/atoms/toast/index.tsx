import type { VariantProps } from "class-variance-authority";

import type { ComponentPropsWithoutRef, ComponentRef, RefObject } from "react";

import { Root } from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";

import { cn } from "@/components/prod/utils/cn";

const toastVariants = cva(
  [
    "group pointer-events-auto relative flex flex-col w-full gap-2 justify-between overflow-hidden rounded-md",
    "border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0",
    "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80",
    "data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  ],
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive bg-destructive text-destructive-foreground",
        success: "success bg-success text-success-foreground",
        warning: "warning bg-warning text-warning-foreground",
      },
    },
  }
);

const Toast = ({
  className,
  ref,
  variant,
  ...props
}: ComponentPropsWithoutRef<typeof Root> &
  VariantProps<typeof toastVariants> & {
    ref?: RefObject<ComponentRef<typeof Root>>;
  }) => (
  <Root
    className={cn(toastVariants({ variant }), className)}
    ref={ref}
    {...props}
  />
);

export { Toast };
