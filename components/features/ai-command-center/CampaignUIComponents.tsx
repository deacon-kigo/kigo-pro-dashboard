import React from "react";
import { ArrowRight, LucideIcon } from "lucide-react";

// Reusable Step Header Component
interface StepHeaderProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackgroundColor: string;
  onBack: () => void;
}

export function StepHeader({
  stepNumber,
  totalSteps,
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBackgroundColor,
  onBack,
}: StepHeaderProps) {
  return (
    <div
      className="px-4 py-3 border-b"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderColor: "#e5e7eb",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="w-7 h-7 bg-white rounded-full shadow-sm flex items-center justify-center border"
          style={{ borderColor: "#e5e7eb" }}
        >
          <ArrowRight className="w-3 h-3 text-gray-600 rotate-180" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="px-2 py-1 rounded-full"
            style={{
              backgroundColor: "#dbeafe",
              color: "#1d4ed8",
            }}
          >
            <span className="text-xs font-medium">
              Step {stepNumber}/{totalSteps}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-1">{title}</h1>
        <p className="text-gray-600 text-xs">{subtitle}</p>
      </div>
    </div>
  );
}

// Reusable Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function Card({ children, className = "", padding = "md" }: CardProps) {
  const paddingClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border ${paddingClasses[padding]} ${className}`}
      style={{ borderColor: "#e5e7eb" }}
    >
      {children}
    </div>
  );
}

// Reusable Selection Button Component
interface SelectionButtonProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "default" | "compact";
}

export function SelectionButton({
  children,
  isSelected = false,
  onClick,
  variant = "default",
}: SelectionButtonProps) {
  const sizeClasses = variant === "compact" ? "p-2" : "p-3";

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses} rounded-xl border transition-all font-medium ${
        isSelected ? "shadow-md" : "hover:shadow-md"
      }`}
      style={{
        backgroundColor: isSelected ? "#dbeafe" : "#ffffff",
        borderColor: isSelected ? "#3b82f6" : "#e5e7eb",
        color: isSelected ? "#1d4ed8" : "#374151",
      }}
    >
      {children}
    </button>
  );
}

// Reusable Info Banner Component
interface InfoBannerProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackgroundColor: string;
  backgroundColor: string;
  borderColor: string;
}

export function InfoBanner({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBackgroundColor,
  backgroundColor,
  borderColor,
}: InfoBannerProps) {
  return (
    <div
      className="rounded-xl p-3 mb-4 border"
      style={{
        background: backgroundColor,
        borderColor: borderColor,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Icon className="w-3 h-3" style={{ color: iconColor }} />
        </div>
        <div>
          <h3 className="font-medium text-xs" style={{ color: iconColor }}>
            {title}
          </h3>
          <p className="text-xs" style={{ color: "#7c2d12" }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable Action Buttons Component
interface ActionButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextColor?: string;
  isLoading?: boolean;
}

export function ActionButtons({
  onBack,
  onNext,
  backLabel = "← Back",
  nextLabel = "Next →",
  nextColor = "#2563eb",
  isLoading = false,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2 pb-4">
      {onBack && (
        <button
          onClick={onBack}
          className="flex-1 py-2 px-3 border rounded-lg font-medium text-gray-600 hover:text-gray-800 transition-colors text-sm"
          style={{ borderColor: "#e5e7eb" }}
        >
          {backLabel}
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          disabled={isLoading}
          className="flex-1 py-2 px-3 rounded-lg font-medium text-white transition-colors text-sm"
          style={{ backgroundColor: nextColor }}
        >
          {isLoading ? "Loading..." : nextLabel}
        </button>
      )}
    </div>
  );
}

// Reusable Section Header Component
interface SectionHeaderProps {
  title: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SectionHeader({
  title,
  size = "md",
  className = "",
}: SectionHeaderProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <h2
      className={`font-semibold text-gray-900 mb-3 ${sizeClasses[size]} ${className}`}
    >
      {title}
    </h2>
  );
}

// Reusable Option Card Component
interface OptionCardProps {
  title: string;
  description: string;
  category?: string;
  price?: string | number;
  image?: string;
  isSelected?: boolean;
  onToggle?: () => void;
  showCheckbox?: boolean;
}

export function OptionCard({
  title,
  description,
  category,
  price,
  image,
  isSelected = false,
  onToggle,
  showCheckbox = false,
}: OptionCardProps) {
  return (
    <Card className="transition-all cursor-pointer" onClick={onToggle}>
      <div className="flex items-center gap-3">
        {showCheckbox && (
          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="w-4 h-4 rounded border-2 pointer-events-none"
              style={{
                borderColor: isSelected ? "#2563eb" : "#d1d5db",
                backgroundColor: isSelected ? "#2563eb" : "#ffffff",
              }}
            />
          </div>
        )}

        {image && (
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm text-gray-900">{title}</h3>
            {price && (
              <span className="text-sm font-bold" style={{ color: "#059669" }}>
                {typeof price === "string" ? price : `$${price}`}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-1">{description}</p>
          {category && (
            <div className="flex items-center justify-between">
              <span
                className="px-2 py-0.5 text-xs font-medium rounded-full"
                style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}
              >
                {category}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Reusable Step Container Component
interface StepContainerProps {
  children: React.ReactNode;
  stepRef?: React.RefObject<HTMLDivElement>;
}

export function StepContainer({ children, stepRef }: StepContainerProps) {
  return (
    <div className="animate-fade-in flex-1 overflow-y-auto" ref={stepRef}>
      {children}
    </div>
  );
}

// Reusable Content Section Component
interface ContentSectionProps {
  children: React.ReactNode;
  padding?: boolean;
}

export function ContentSection({
  children,
  padding = true,
}: ContentSectionProps) {
  return <div className={padding ? "px-4 py-3" : ""}>{children}</div>;
}
