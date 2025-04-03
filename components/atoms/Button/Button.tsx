import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { useDemoState } from "@/lib/redux/hooks"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary action button - uses theme colors
        primary: "bg-primary text-white shadow-sm",
        
        // Secondary actions
        secondary: "bg-gray-100 text-gray-800",
        
        // Destructive actions
        destructive: "bg-red-500 text-white shadow-sm",
        
        // Subtle buttons
        outline: "border border-border-light bg-white",
        ghost: "text-gray-700",
        link: "text-primary underline-offset-4",
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
        active: "",
        selected: "",
      },
      branded: {
        // No specific branding, uses regular theme colors
        default: "",
        // CVS branded styles will be applied when this is true
        cvs: "",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      state: "default",
      branded: "default"
    },
    compoundVariants: [
      // ============== PRIMARY BUTTON VARIANTS ==============
      // Primary - Default
      {
        variant: "primary",
        branded: "default",
        className: "hover:bg-primary-dark active:bg-primary-darker"
      },
      // Primary - Active
      {
        variant: "primary",
        state: "active",
        branded: "default",
        className: "ring-primary ring-offset-1"
      },
      // Primary - Selected
      {
        variant: "primary",
        state: "selected",
        branded: "default",
        className: "bg-primary-dark"
      },
      
      // ============== PRIMARY CVS VARIANTS ==============
      // Primary - CVS Branded
      {
        variant: "primary", 
        branded: "cvs",
        className: "bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 active:from-blue-800 active:to-red-800"
      },
      // Primary - CVS Active
      {
        variant: "primary",
        state: "active",
        branded: "cvs",
        className: "ring-blue-600 ring-offset-1"
      },
      
      // ============== SECONDARY BUTTON VARIANTS ==============
      // Secondary - Default
      {
        variant: "secondary",
        branded: "default",
        className: "hover:bg-gray-200 active:bg-gray-300"
      },
      // Secondary - Active
      {
        variant: "secondary",
        state: "active",
        branded: "default", 
        className: "ring-gray-300 ring-offset-1"
      },
      // Secondary - Selected
      {
        variant: "secondary",
        state: "selected",
        branded: "default",
        className: "bg-gray-200 text-gray-900"
      },
      
      // ============== SECONDARY CVS VARIANTS ==============
      // Secondary - CVS Branded
      {
        variant: "secondary",
        branded: "cvs",
        className: "bg-gradient-to-r from-blue-50 to-red-50 text-gray-800 hover:from-blue-100 hover:to-red-100 active:from-blue-200 active:to-red-200"
      },
      
      // ============== OUTLINE BUTTON VARIANTS ==============
      // Outline - Default
      {
        variant: "outline",
        branded: "default",
        className: "hover:bg-primary-light hover:text-primary hover:border-primary active:bg-primary-lighter"
      },
      // Outline - Active
      {
        variant: "outline", 
        state: "active",
        branded: "default",
        className: "border-primary text-primary bg-primary-lighter ring-primary"
      },
      // Outline - Selected
      {
        variant: "outline",
        state: "selected", 
        branded: "default",
        className: "border-primary text-primary bg-primary-light"
      },
      
      // ============== OUTLINE CVS VARIANTS ==============
      // Outline - CVS Branded
      {
        variant: "outline",
        branded: "cvs",
        className: "hover:border-blue-600 hover:text-blue-600 active:bg-blue-50"
      },
      // Outline - CVS Active
      {
        variant: "outline",
        state: "active", 
        branded: "cvs",
        className: "border-blue-600 text-blue-600 bg-blue-50 ring-blue-600"
      },
      // Outline - CVS Selected
      {
        variant: "outline",
        state: "selected",
        branded: "cvs",
        className: "border-blue-600 bg-gradient-to-r from-blue-600 to-red-600 text-white"
      },
      
      // ============== GHOST BUTTON VARIANTS ==============
      // Ghost - Default
      {
        variant: "ghost",
        branded: "default",
        className: "hover:bg-primary-light hover:text-primary active:bg-primary-lighter"
      },
      // Ghost - Active
      {
        variant: "ghost",
        state: "active",
        branded: "default", 
        className: "text-primary bg-primary-lighter ring-primary"
      },
      // Ghost - Selected
      {
        variant: "ghost", 
        state: "selected",
        branded: "default",
        className: "text-primary bg-primary-light"
      },
      
      // ============== GHOST CVS VARIANTS ==============
      // Ghost - CVS Branded
      {
        variant: "ghost",
        branded: "cvs",
        className: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 hover:text-gray-800"
      },
      // Ghost - CVS Active/Selected
      {
        variant: "ghost",
        state: ["active", "selected"],
        branded: "cvs",
        className: "bg-gradient-to-r from-blue-50 to-red-50 text-gray-800"
      },
      
      // ============== LINK BUTTON VARIANTS ==============
      // Link - Default
      {
        variant: "link",
        branded: "default",
        className: "hover:underline hover:text-primary-dark"
      },
      
      // ============== LINK CVS VARIANTS ==============
      // Link - CVS Branded
      {
        variant: "link",
        branded: "cvs",
        className: "bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent hover:underline"
      },
      
      // ============== DESTRUCTIVE BUTTON VARIANTS ==============
      // Destructive - Default (same for both branded and unbranded)
      {
        variant: "destructive",
        className: "hover:bg-red-600 active:bg-red-700"
      },
      // Destructive - Active
      {
        variant: "destructive",
        state: "active",
        className: "ring-red-500 ring-offset-1"
      },
    ]
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, state, branded, asChild = false, href, icon, children, ...props }, ref) => {
    // Get client context from demo state if available
    const demoState = useClientContext();
    
    // Determine branding based on client context
    const buttonBranding = branded || (demoState?.isCVSContext ? "cvs" : "default");
    
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
          className={cn(buttonVariants({ variant, size, state, branded: buttonBranding, className }))}
          {...linkProps}
        >
          {buttonContent}
        </Link>
      );
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, state, branded: buttonBranding, className }))}
        ref={ref}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
)
Button.displayName = "Button"

// Helper to get client context, with fallback
function useClientContext() {
  try {
    const { clientId } = useDemoState();
    const isCVSContext = clientId === 'cvs';
    return { clientId, isCVSContext };
  } catch (error) {
    // Return default context if hook is not available
    return { clientId: null, isCVSContext: false };
  }
}

export { Button, buttonVariants } 