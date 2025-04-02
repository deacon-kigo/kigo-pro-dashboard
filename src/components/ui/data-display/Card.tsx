'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "bg-white rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border border-gray-200 shadow-sm",
        elevated: "shadow-md hover:shadow-lg",
        outline: "border-2 border-primary/10",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string;
  titleClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

/**
 * Card component for displaying content in a contained, styled container
 * 
 * @param title - Optional card title
 * @param children - Card content
 * @param className - Additional class names for the card container
 * @param titleClassName - Additional class names for the title
 * @param bodyClassName - Additional class names for the content container
 * @param variant - Card style variant
 * @param size - Card size variant
 */
export default function Card({
  className,
  title,
  titleClassName,
  bodyClassName,
  variant,
  size,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    >
      {title && (
        <div className={cn("pb-3 font-medium text-base border-b border-gray-100", titleClassName)}>
          {title}
        </div>
      )}
      <div className={cn("", bodyClassName)}>{children}</div>
    </div>
  );
} 