import type { VariantProps } from "class-variance-authority";

import type * as React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/components/prod/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-fit",
  {
    defaultVariants: {
      color: "primary",
      roundness: "default",
      size: "default",
      variant: "solid",
    },
    variants: {
      color: {
        destructive:
          "bg-destructive text-destructive-foreground border-destructive border",
        info: "bg-blue-50 border-blue-50 border",
        neutral: "bg-gray-100 text-gray-800 border-gray-100 border",
        primary: "bg-primary text-primary-foreground border-primary border",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary border",
        success: "bg-success text-success-foreground border-success border",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-100 border",
      },
      roundness: {
        default: "rounded-full",
        md: "rounded-md",
        none: "rounded-none",
        sm: "rounded-sm",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        xs: "px-1.5 py-0.5 text-xs",
      },
      variant: {
        outline: "text-foreground bg-transparent",
        solid: "",
      },
    },
  }
);

interface BadgeProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof badgeVariants> {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Badge = ({
  className,
  color,
  icon: Icon,
  ref,
  roundness,
  size,
  variant,
  ...props
}: BadgeProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    className={cn(
      badgeVariants({ color, roundness, size, variant }),
      Icon && "gap-1.5",
      className
    )}
    data-testid="badge"
    ref={ref}
    {...props}
  >
    {Icon && <Icon className="size-3.5 shrink-0" />}
    {props.children}
  </div>
);

Badge.displayName = "Badge";

export { Badge };
