"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Badge as ShadcnBadge,
  badgeVariants as shadcnBadgeVariants,
} from "@/components/ui/badge";

// Enhanced badge variants with more options
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        error: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        neutral:
          "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
      rounded: {
        default: "rounded-full",
        md: "rounded-md",
        sm: "rounded-sm",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

// Extended props interface
export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  withDot?: boolean;
  dotColor?: string;
  className?: string;
  // Support direct text content for easier usage
  children?: React.ReactNode;
}

function Badge({
  className,
  variant = "default",
  size,
  rounded,
  icon,
  iconPosition = "left",
  withDot = false,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  // Choose dot color based on variant if not provided
  const defaultDotColors = {
    default: "bg-primary-foreground",
    secondary: "bg-secondary-foreground",
    destructive: "bg-destructive-foreground",
    outline: "bg-foreground",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    error: "bg-red-500",
    neutral: "bg-gray-500",
  };

  const dotColorClass =
    dotColor ||
    (variant
      ? defaultDotColors[variant as keyof typeof defaultDotColors]
      : defaultDotColors.default);

  // Map our variants to shadcn variants when possible
  const getShadcnVariant = (variant: string | undefined) => {
    switch (variant) {
      case "default":
      case "secondary":
      case "destructive":
      case "outline":
        return variant;
      default:
        return undefined;
    }
  };

  const shadcnVariant = getShadcnVariant(variant);

  // For variants that don't map directly to shadcn, use our custom badgeVariants
  const customVariantClass = !shadcnVariant
    ? badgeVariants({ variant, size, rounded })
    : "";

  return (
    <ShadcnBadge
      variant={shadcnVariant}
      className={cn(
        customVariantClass,
        size && `text-${size}`,
        rounded && `rounded-${rounded}`,
        className
      )}
      {...props}
    >
      {withDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full mr-1", dotColorClass)} />
      )}
      {icon && iconPosition === "left" && (
        <span className="mr-1 -ml-0.5 h-3.5 w-3.5">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-1 -mr-0.5 h-3.5 w-3.5">{icon}</span>
      )}
    </ShadcnBadge>
  );
}

export { Badge, badgeVariants };
