import type { ComponentProps } from "react";

import { cn } from "@/components/prod/utils/cn";

interface InputProps extends ComponentProps<"input"> {
  id: string;
  ref?: React.Ref<HTMLInputElement> | undefined;
}

const Input = ({ className, ref, ...props }: InputProps) => (
  <input
    className={cn(
      "transition-[color]",
      "bg-background ring-offset-background placeholder:text-foreground/50 flex h-10 w-full rounded-md border px-3 py-2 text-base md:text-sm",
      "file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-1 focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
      className
    )}
    ref={ref}
    {...props}
  />
);

Input.displayName = "Input";

export { Input, type InputProps };
