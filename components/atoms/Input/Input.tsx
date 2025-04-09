import * as React from "react"
import { Input as ShadcnInput } from "@/components/ui/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define custom classes for our variants
const customVariants = cva("", {
  variants: {
    variant: {
      default: "border-gray-200",
      error: "border-red-500 focus-visible:ring-red-500",
    },
    inputSize: {
      default: "",
      sm: "h-8 px-3 py-1 text-xs",
      lg: "h-12 px-4 py-3 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    inputSize: "default",
  },
})

export interface InputProps
  extends Omit<React.ComponentProps<typeof ShadcnInput>, "size"> {
  variant?: "default" | "error";
  inputSize?: "default" | "sm" | "lg";
  htmlSize?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", inputSize = "default", htmlSize, ...props }, ref) => {
    // Get custom classes based on our variants
    const customClasses = customVariants({ variant, inputSize });
    
    return (
      <ShadcnInput
        className={cn(customClasses, className)}
        size={htmlSize}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 