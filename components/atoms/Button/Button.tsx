"use client";
import * as React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlowEffect, GlowEffectProps } from "@/components/effects/GlowEffect";

// Simple type definition
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive";
type ButtonTheme = "kigo" | "cvs";

// Simple props interface that includes ShadCN button props but defines our own variant
interface ButtonProps
  extends Omit<React.ComponentPropsWithRef<typeof ShadcnButton>, "variant"> {
  variant?: ButtonVariant;
  theme?: ButtonTheme;
  icon?: React.ReactNode;
  href?: string;
  glow?: boolean | GlowEffectProps;
}

// Simple CSS class map for CVS theme
const cvsThemeStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-700 hover:to-red-700",
  secondary:
    "bg-gradient-to-r from-blue-50 to-red-50 text-gray-800 hover:from-blue-100 hover:to-red-100",
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
  destructive: "destructive",
} as const;

// Default glow effect based on variant
const defaultGlowEffects: Record<ButtonVariant, GlowEffectProps> = {
  primary: {
    colors: ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
    mode: "colorShift",
    blur: "soft",
    scale: 0.95,
    duration: 3,
  },
  secondary: {
    colors: ["#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280"],
    mode: "pulse",
    blur: "soft",
    scale: 0.95,
    duration: 4,
  },
  outline: {
    colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
    mode: "breathe",
    blur: "soft",
    scale: 0.95,
    duration: 4,
  },
  ghost: {
    colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
    mode: "breathe",
    blur: "soft",
    scale: 0.95,
    duration: 5,
  },
  link: {
    colors: ["#3b82f6", "#2563eb"],
    mode: "flowHorizontal",
    blur: "soft",
    scale: 0.95,
    duration: 3,
  },
  destructive: {
    colors: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b"],
    mode: "pulse",
    blur: "soft",
    scale: 0.95,
    duration: 2,
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      theme = "kigo",
      icon,
      children,
      href,
      glow,
      ...props
    },
    ref
  ) => {
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

    // Configure glow effect if enabled
    const glowProps: GlowEffectProps | undefined = glow
      ? typeof glow === "boolean"
        ? defaultGlowEffects[variant]
        : { ...defaultGlowEffects[variant], ...glow }
      : undefined;

    // Custom colors for CVS theme glow
    if (glowProps && theme === "cvs" && variant === "primary") {
      glowProps.colors = ["#2563eb", "#3b82f6", "#cc0000", "#ef4444"];
    }

    // Apply outline styling for glow effect
    const outlineClass = glow
      ? "outline outline-1 outline-[#ffffff1a] relative z-10"
      : "";

    // Wrapper component with potential glow effect
    const ButtonWithGlow = ({ children }: { children: React.ReactNode }) => (
      <div className="relative inline-flex">
        {glow && <GlowEffect {...glowProps} className="z-0" />}
        {children}
      </div>
    );

    // For links, use anchor tag
    if (href) {
      return (
        <ButtonWithGlow>
          <ShadcnButton
            asChild
            className={cn(themeClass, outlineClass, className)}
            variant={shadcnVariant}
            // We don't forward the ref here because the component prop types expect HTMLButtonElement
            // but when using asChild with an anchor tag, it would need HTMLAnchorElement
            // This avoids TypeScript errors while still providing expected functionality
            {...props}
          >
            <a href={href}>{content}</a>
          </ShadcnButton>
        </ButtonWithGlow>
      );
    }

    // Regular button
    return (
      <ButtonWithGlow>
        <ShadcnButton
          className={cn(themeClass, outlineClass, className)}
          variant={shadcnVariant}
          ref={ref}
          {...props}
        >
          {content}
        </ShadcnButton>
      </ButtonWithGlow>
    );
  }
);

Button.displayName = "Button";

export { Button };
