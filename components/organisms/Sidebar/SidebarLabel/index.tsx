import Link from "next/link";
import { ComponentType, SVGProps } from "react";

// Type for HeroIcon components
type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface SidebarLabelProps {
  href: string;
  icon: HeroIcon;
  title: string;
  isActive: boolean;
  isCollapsed: boolean;
  isCVSContext: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
}

export default function SidebarLabel({
  href,
  icon: Icon,
  title,
  isActive,
  isCollapsed,
  isCVSContext,
  hasNotification,
  notificationCount
}: SidebarLabelProps) {
  // Console log for debugging
  console.log('SidebarLabel rendering with props:', { 
    href, title, isActive, isCollapsed, isCVSContext, hasNotification 
  });
  
  // Validate that Icon is defined
  if (!Icon) {
    console.error('SidebarLabel: Icon prop is undefined');
    return null;
  }
  
  // Generate CSS classes for the CVS context gradient
  const getCVSGradientClasses = () => {
    // Use explicit tailwind classes for the gradient
    const gradientClasses = "bg-gradient-to-r from-pastel-blue to-pastel-red text-gray-800";
    console.log('Using CVS gradient classes:', gradientClasses);
    return gradientClasses;
  };
  
  // Active state classes
  const getActiveClasses = () => {
    if (!isActive) return "text-gray-500";
    return isCVSContext 
      ? getCVSGradientClasses()
      : "bg-blue-100 text-gray-800 font-medium";
  };
  
  // Hover classes
  const getHoverClasses = () => {
    return isCVSContext 
      ? "hover:bg-gradient-to-r hover:from-pastel-blue hover:to-pastel-red hover:text-gray-800"
      : "hover:bg-blue-100 hover:text-gray-800";
  };

  // Single styling approach with extracted methods for clarity
  const linkClasses = `
    flex items-center py-2 text-sm font-medium rounded-lg
    ${isCollapsed ? "justify-center px-2" : "px-3"}
    ${getActiveClasses()}
    ${getHoverClasses()}
  `;

  const iconClasses = `w-5 h-5 ${isCollapsed ? "" : "mr-3"} ${
    isActive ? (isCVSContext ? "text-gray-800" : "text-primary") : "text-gray-500"
  }`;

  return (
    <Link href={href} className={linkClasses} title={title}>
      <Icon className={iconClasses} />
      {!isCollapsed && (
        <span className={isActive ? (isCVSContext ? "font-semibold" : "font-medium") : ""}>
          {title}
        </span>
      )}
      {!isCollapsed && hasNotification && (
        <span className="bg-pastel-red text-red-600 text-xs rounded-full px-1.5 py-0.5 ml-auto">
          {notificationCount}
        </span>
      )}
    </Link>
  );
} 