import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/components/prod/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.Ref<HTMLTextAreaElement>;
}

const Textarea = ({ className, ref, ...props }: TextareaProps) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full",
      "rounded-md border",
      "transition-[color]",
      "bg-background px-3 py-2 text-base md:text-sm",
      "ring-offset-background placeholder:text-foreground/50",
      "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-1 focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
      className
    )}
    ref={ref}
    {...props}
  />
);

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
