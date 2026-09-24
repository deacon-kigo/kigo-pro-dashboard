import type React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/components/prod/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  elevation?: 1 | 2 | 3 | 4;
  roundness?: "lg" | "xl";
}

const cardVariants = cva("rounded-3xl bg-background border border-gray-200", {
  defaultVariants: {
    elevation: 1,
    roundness: "xl",
  },
  variants: {
    elevation: {
      1: "shadow-sm",
      2: "shadow-md",
      3: "shadow-lg",
      4: "shadow-xl",
    },
    roundness: {
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
  },
});

const Card = ({
  className,
  elevation,
  ref,
  roundness,
  ...props
}: CardProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    className={cn(cardVariants({ elevation, roundness }), className)}
    data-testid="card"
    ref={ref}
    {...props}
  />
);

Card.displayName = "Card";

export { Card };
