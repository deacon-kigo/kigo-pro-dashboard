import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

// Define our variant types
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";
type ButtonState = "default" | "active" | "selected";
type ButtonTheme = "kigo" | "cvs";

// Define theme-specific styles using CSS classes
const themeStyles: Record<ButtonTheme, Record<ButtonVariant, string>> = {
  kigo: {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "hover:bg-blue-50 text-blue-600",
    link: "text-blue-600 hover:underline",
    destructive: "bg-red-600 text-white hover:bg-red-700", // Custom destructive
  },
  cvs: {
    primary:
      "bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-700 hover:to-red-700 active:from-blue-800 active:to-red-800",
    secondary:
      "bg-gradient-to-r from-blue-50 to-red-50 text-gray-800 hover:from-blue-100 hover:to-red-100",
    outline: "border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50",
    link: "bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent hover:underline",
    destructive: "bg-red-600 text-white hover:bg-red-700", // Custom destructive
  },
};

// Size styles
const sizeStyles: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3 py-1 text-xs",
  lg: "h-11 rounded-md px-8 py-3 text-base",
  icon: "h-10 w-10 p-2",
};

// Define state styles
const stateStyles: Record<ButtonState, string> = {
  default: "",
  active: "ring-2 ring-offset-1",
  selected: "ring-1 ring-inset",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme?: ButtonTheme;
  state?: ButtonState;
  icon?: React.ReactNode;
  href?: string;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      theme = "kigo",
      state = "default",
      icon,
      href,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    // Get theme-specific style for this variant
    const themeStyle = themeStyles[theme][variant];

    // Get size style
    const sizeStyle = sizeStyles[size];

    // Get state-specific style
    const stateStyle = stateStyles[state];

    const buttonContent = (
      <>
        {icon && (
          <span className={cn("inline-flex", children ? "mr-2" : "")}>
            {icon}
          </span>
        )}
        {children}
      </>
    );

    // Base button styles
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    // Handle href prop for link buttons
    if (href) {
      return (
        <Link
          href={href}
          className={cn(
            baseStyles,
            sizeStyle,
            themeStyle,
            stateStyle,
            className
          )}
        >
          {buttonContent}
        </Link>
      );
    }

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(baseStyles, sizeStyle, themeStyle, stateStyle, className)}
        ref={ref}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
