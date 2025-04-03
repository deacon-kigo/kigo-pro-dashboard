import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-dark active:bg-primary-darker shadow-sm",
        destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
        outline: "border border-border-light bg-white hover:bg-primary-light hover:text-primary hover:border-primary active:bg-primary-lighter",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300",
        ghost: "text-gray-700 hover:bg-primary-light hover:text-primary active:bg-primary-lighter",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-dark",
        gradient: "bg-gradient-to-r from-blue-600 to-primary text-white hover:from-blue-700 hover:to-primary-dark active:from-blue-800 active:to-primary-darker shadow-sm",
        "cvs-gradient": "bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-700 hover:to-red-700 active:from-blue-800 active:to-red-800 shadow-sm",
        "cvs-outline": "border border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 active:bg-blue-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        md: "h-10 rounded-md px-4 py-2", 
        lg: "h-11 rounded-md px-6 py-2.5 text-base",
        xl: "h-12 rounded-md px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
      state: {
        default: "",
        active: "ring-2 ring-primary ring-offset-1",
        selected: "bg-primary-light text-primary border-primary"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default"
    },
    compoundVariants: [
      {
        variant: "outline",
        state: "active",
        className: "border-primary text-primary bg-primary-lighter"
      },
      {
        variant: "outline",
        state: "selected",
        className: "border-primary text-primary bg-primary-light"
      },
      {
        variant: "cvs-outline",
        state: "active",
        className: "border-blue-600 text-blue-600 bg-blue-50"
      },
      {
        variant: "cvs-outline",
        state: "selected",
        className: "border-blue-600 text-white bg-gradient-to-r from-blue-600 to-red-600"
      }
    ]
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  icon?: React.ReactNode;
  state?: "default" | "active" | "selected";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, state, asChild = false, href, icon, children, ...props }, ref) => {
    const buttonContent = (
      <>
        {icon && <span className={cn("inline-flex", children ? "mr-2" : "")}>{icon}</span>}
        {children}
      </>
    )
    
    if (href) {
      // Filter out button-specific props that can't be applied to a Link
      const { type, ...linkProps } = props as any;
      
      return (
        <Link 
          href={href}
          className={cn(buttonVariants({ variant, size, state, className }))}
          {...linkProps}
        >
          {buttonContent}
        </Link>
      );
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, state, className }))}
        ref={ref}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 