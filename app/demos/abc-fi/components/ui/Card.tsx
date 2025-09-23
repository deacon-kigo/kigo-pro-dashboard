import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  shadow?: "sm" | "md" | "lg";
  padding?: "sm" | "md" | "lg";
  background?: string;
}

export function Card({
  children,
  className = "",
  gradient = false,
  shadow = "md",
  padding = "md",
  background,
}: CardProps) {
  const shadowClasses = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg shadow-black/10",
  };

  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  // Check if className contains background classes or if we have a custom background
  const hasCustomBackground =
    className.includes("bg-") ||
    className.includes("from-") ||
    className.includes("to-") ||
    background;

  const baseClasses = `
    rounded-2xl 
    ${shadowClasses[shadow]} 
    ${paddingClasses[padding]}
    ${!hasCustomBackground ? "border border-gray-300" : ""}
    backdrop-blur-sm
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  // Default background style using hex colors
  const defaultStyle = !hasCustomBackground
    ? {
        background: gradient
          ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
          : "#ffffff",
        borderColor: "#d1d5db",
      }
    : {};

  return (
    <div className={baseClasses} style={defaultStyle}>
      {children}
    </div>
  );
}
