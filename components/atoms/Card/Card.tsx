"use client";

import React from "react";

type CardProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "default" | "elevated" | "gradient";
  gradientFrom?: string;
  gradientTo?: string;
  cardIcon?: React.ReactNode;
  headerContent?: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * A reusable card component for displaying content in a contained box
 *
 * @component
 * @example
 * // Default card
 * <Card>Content</Card>
 *
 * // Card with title
 * <Card title="Card Title">Content</Card>
 *
 * // Elevated card with soft shadow
 * <Card variant="elevated">Content</Card>
 *
 * // Gradient card
 * <Card variant="gradient" gradientFrom="from-blue-500" gradientTo="to-indigo-600">Content</Card>
 *
 * // Card with custom styles
 * <Card style={{ background: 'linear-gradient(...)', boxShadow: '...' }}>Content</Card>
 */
export default function Card({
  children,
  title,
  className = "",
  style,
  variant = "default",
  gradientFrom = "from-blue-500",
  gradientTo = "to-indigo-600",
  cardIcon,
  headerContent,
  footer,
}: CardProps) {
  // Base classes for the card
  let cardClasses = "rounded-xl overflow-hidden ";

  // Add variant-specific classes
  switch (variant) {
    case "elevated":
      cardClasses +=
        "bg-white border border-gray-100 shadow-lg shadow-gray-200/50 ";
      break;
    case "gradient":
      cardClasses += `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white `;
      break;
    default:
      cardClasses += "bg-white rounded-xl shadow-sm border border-gray-200 ";
  }

  // Add any custom classes
  cardClasses += className;

  // Determine header text color based on variant
  const headerTextColor =
    variant === "gradient" ? "text-white" : "text-gray-900";

  return (
    <div className={cardClasses} style={style}>
      {(title || headerContent || cardIcon) && (
        <div
          className={`px-5 py-4 ${variant === "gradient" ? "" : "border-b border-gray-200"} flex items-center justify-between`}
        >
          <div className="flex items-center">
            {cardIcon && <div className="mr-3">{cardIcon}</div>}

            {title && (
              <h3 className={`text-lg font-medium ${headerTextColor}`}>
                {title}
              </h3>
            )}
          </div>

          {headerContent && <div className="ml-auto">{headerContent}</div>}
        </div>
      )}

      {/* Check if no-padding class was passed and apply padding accordingly */}
      <div
        className={
          className.includes("p-0")
            ? "h-full"
            : title || headerContent || cardIcon
              ? "px-5 py-4"
              : "p-5 "
        }
      >
        {children}
      </div>

      {footer && (
        <div
          className={`px-5 py-3 ${variant === "gradient" ? "bg-black/10" : "bg-gray-50 border-t border-gray-200"}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
