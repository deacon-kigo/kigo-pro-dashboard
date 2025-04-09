import * as React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Simple type definition
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive";
type ButtonTheme = "kigo" | "cvs";

// Simple props interface that includes ShadCN button props but defines our own variant
interface ButtonProps extends Omit<React.ComponentPropsWithRef<typeof ShadcnButton>, "variant"> {
  variant?: ButtonVariant;
  theme?: ButtonTheme;
  icon?: React.ReactNode;
  href?: string;
}

// Simple CSS class map for CVS theme
const cvsThemeStyles: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-700 hover:to-red-700",
  secondary: "bg-gradient-to-r from-blue-50 to-red-50 text-gray-800 hover:from-blue-100 hover:to-red-100",
  outline: "border-blue-600 text-blue-600 hover:bg-blue-50",
  ghost: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50",
  link: "bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent hover:underline",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

// Map our variants directly to ShadCN variants
const variantMap = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  link: "link",
  destructive: "destructive"
} as const;

// Type of ShadCN button variant
type ShadcnVariant = (typeof variantMap)[ButtonVariant];

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", theme = "kigo", icon, children, href, ...props }, ref) => {
    // Only apply CVS theme classes if theme is cvs
    const themeClass = theme === "cvs" ? cvsThemeStyles[variant] : "";
    
    // Map to ShadCN variant
    const shadcnVariant = variantMap[variant];
    
    // Create content with icon if provided
    const content = (
      <>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </>
    );

    // For links, use anchor tag
    if (href) {
      return (
        <ShadcnButton
          asChild
          className={cn(themeClass, className)}
          variant={shadcnVariant}
          ref={ref}
          {...props}
        >
          <a href={href}>{content}</a>
        </ShadcnButton>
      );
    }

    // Regular button
    return (
      <ShadcnButton
        className={cn(themeClass, className)}
        variant={shadcnVariant}
        ref={ref}
        {...props}
      >
        {content}
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
