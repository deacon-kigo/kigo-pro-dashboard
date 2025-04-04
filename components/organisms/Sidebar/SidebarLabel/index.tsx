import Link from "next/link";
import { ComponentType, SVGProps, MouseEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { themeConfigs } from "@/lib/redux/slices/uiSlice";
import { cn } from "@/lib/utils";

// Type for HeroIcon components
type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface SidebarLabelProps {
  href: string;
  icon: HeroIcon;
  title: string;
  isActive: boolean;
  isCollapsed: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

export default function SidebarLabel({
  href,
  icon: Icon,
  title,
  isActive,
  isCollapsed,
  hasNotification,
  notificationCount,
  onClick,
  className,
}: SidebarLabelProps) {
  // Get theme information directly from Redux
  const { clientId } = useSelector((state: RootState) => state.demo);

  // Determine theme based on client ID
  const themeName = clientId === "cvs" ? "cvs" : "default";
  const theme =
    themeConfigs[themeName]?.sidebar?.item || themeConfigs.default.sidebar.item;

  // For debugging in development
  // console.log("SidebarLabel theme:", themeName, theme, clientId);

  // Validate that Icon is defined
  if (!Icon) {
    console.error("SidebarLabel: Icon prop is undefined");
    return null;
  }

  // Determine if we're using CVS theme
  const isCvsTheme = themeName === "cvs";

  // Classes for active and inactive states
  const activeClasses = theme.active;
  const inactiveClasses = theme.inactive;

  // Hover classes that match the active state
  const hoverClasses = isCvsTheme
    ? "hover:bg-gradient-to-r hover:from-pastel-blue hover:to-pastel-red hover:text-gray-800"
    : "hover:bg-pastel-blue hover:text-gray-800";

  // Icon classes based on state and theme
  const getIconClasses = () => {
    if (isActive) {
      // For CVS, ensure icon is dark on the gradient background
      return isCvsTheme ? "text-gray-800" : theme.icon.active;
    } else {
      return `${theme.icon.inactive} ${isCvsTheme ? "group-hover:text-gray-800" : "group-hover:text-primary"}`;
    }
  };

  // Text classes based on state and theme
  const getTextClasses = () => {
    if (isActive) {
      // For CVS, ensure text is semibold when active
      return isCvsTheme ? "font-semibold" : theme.text.active;
    } else {
      return `${theme.text.inactive} ${isCvsTheme ? "group-hover:font-semibold" : "group-hover:font-medium"}`;
    }
  };

  // Combine all classes for the link
  const linkClasses = cn(
    "flex items-center py-2 text-sm font-medium rounded-lg group",
    isCollapsed ? "justify-center px-2" : "px-3",
    isActive ? activeClasses : inactiveClasses,
    !isActive ? hoverClasses : "",
    "transition-all duration-200",
    className // Add custom className
  );

  // Icon classes
  const iconClasses = `
    w-5 h-5 
    ${isCollapsed ? "" : "mr-3"} 
    ${getIconClasses()}
    transition-colors duration-200
  `;

  return (
    <Link
      href={href}
      className={linkClasses}
      title={title}
      onClick={onClick} // Add onClick handler
    >
      <Icon className={iconClasses} />
      {!isCollapsed && <span className={getTextClasses()}>{title}</span>}
      {!isCollapsed && hasNotification && (
        <span className="bg-pastel-red text-red-600 text-xs rounded-full px-1.5 py-0.5 ml-auto">
          {notificationCount}
        </span>
      )}
    </Link>
  );
}
