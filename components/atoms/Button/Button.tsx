import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useDemoState } from "@/lib/redux/hooks"

// Streamlined button variants with consistent states
const buttonVariants = cva(
  // Base styles applied to all buttons with focus states
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      // Core button variants with distinct hover states using standard opacity patterns
      variant: {
        primary: "bg-primary text-white hover:bg-primary/80 active:bg-primary/90 focus-visible:ring-primary/50",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400/50",
        destructive: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-500/50",
        outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 focus-visible:ring-gray-400/50",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 focus-visible:ring-gray-400/50",
      },
      
      // Size variants
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10 p-2",
      },
      
      // Animation variant
      animated: {
        true: "relative z-10",
        false: "",
      }
    },
    
    // Default values
    defaultVariants: {
      variant: "primary",
      size: "md",
      animated: false,
    },
  }
)

// Button props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  asLink?: boolean;
}

// Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animated, href, icon, isActive, asLink, children, ...props }, ref) => {
    // Determine if this is a destructive button
    const isDestructive = variant === "destructive";
    
    // Apply link styling if asLink is true
    const linkClass = asLink ? "underline-offset-4 hover:underline text-primary hover:text-primary/80" : "";
    
    // Handle active state styling with an explicit class
    const activeClass = isActive 
      ? isDestructive 
        ? "bg-red-700 ring-2 ring-red-500 ring-offset-1" 
        : "bg-primary/90 ring-2 ring-primary ring-offset-1"
      : "";
    
    // Create button classes
    const buttonClasses = cn(
      buttonVariants({ variant: asLink ? "ghost" : variant, size, animated }),
      linkClass,
      activeClass,
      className
    );
    
    // Button content with icon if provided
    const buttonContent = (
      <>
        {icon && <span className={cn("inline-flex", children ? "mr-2" : "")}>{icon}</span>}
        {children}
      </>
    );
    
    // Add animated border wrapper if needed
    const renderWithAnimation = (element: React.ReactNode) => {
      if (!animated) return element;
      
      // Use color appropriate for the variant
      const gradientClasses = isDestructive
        ? "bg-gradient-to-r from-red-500 via-red-600 to-red-500"
        : "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500";
      
      return (
        <div className="relative">
          <div className={cn(
            "absolute -inset-0.5 rounded-md opacity-50 blur-[2px] animate-pulse transition-opacity", 
            gradientClasses
          )}></div>
          {element}
        </div>
      );
    };
    
    // Render as Link or Button
    if (href) {
      return renderWithAnimation(
        <Link href={href} className={buttonClasses} {...(props as any)}>
          {buttonContent}
        </Link>
      );
    }
    
    return renderWithAnimation(
      <button ref={ref} className={buttonClasses} {...props}>
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants } 