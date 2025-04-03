import Link from "next/link";
import { ComponentType, SVGProps } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { themeConfigs } from "@/lib/redux/slices/uiSlice";

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
}

export default function SidebarLabel({
  href,
  icon: Icon,
  title,
  isActive,
  isCollapsed,
  hasNotification,
  notificationCount,
}: SidebarLabelProps) {
  // Get theme information directly from Redux
  const { clientId } = useSelector((state: RootState) => state.demo);

  // Determine theme based on client ID
  const themeName = clientId === "cvs" ? "cvs" : "default";
  const theme =
    themeConfigs[themeName]?.sidebar?.item || themeConfigs.default.sidebar.item;

  // Validate that Icon is defined
  if (!Icon) {
    console.error("SidebarLabel: Icon prop is undefined");
    return null;
  }

  // Get the appropriate styles based on state and theme
  const getBaseClasses = () => {
    return isActive ? theme.active : theme.inactive;
  };

  // Get hover classes from theme - only apply to inactive items
  const getHoverClasses = () => {
    return isActive ? "" : theme.hover;
  };

  // Get icon classes based on active state
  const getIconClasses = () => {
    return isActive ? theme.icon.active : theme.icon.inactive;
  };

  // Get text classes based on active state
  const getTextClasses = () => {
    return isActive ? theme.text.active : theme.text.inactive;
  };

  // Combine all styling into a single class string
  const linkClasses = `
    flex items-center py-2 text-sm font-medium rounded-lg group
    ${isCollapsed ? "justify-center px-2" : "px-3"}
    ${getBaseClasses()}
    ${getHoverClasses()}
  `;

  // Include icon hover effect within the icon classes
  const iconClasses = `
    w-5 h-5 
    ${isCollapsed ? "" : "mr-3"} 
    ${getIconClasses()}
    ${isActive ? "" : "group-hover:text-primary"}
  `;

  return (
    <Link href={href} className={linkClasses} title={title}>
      <Icon className={iconClasses} />
      {!isCollapsed && (
        <span
          className={`${getTextClasses()} ${isActive ? "" : "group-hover:font-medium"}`}
        >
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
