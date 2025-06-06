"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ComponentType, SVGProps, MouseEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { themeConfigs } from "@/lib/redux/slices/uiSlice";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Type for HeroIcon components
type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface SubmenuItem {
  href: string;
  title: string;
  isActive: boolean;
}

export interface SidebarLabelProps {
  href: string;
  icon: HeroIcon;
  title: string;
  isActive: boolean;
  isCollapsed: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuItem[];
  isSubmenuOpen?: boolean;
  onToggleSubmenu?: () => void;
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
  hasSubmenu,
  submenuItems,
  isSubmenuOpen,
  onToggleSubmenu,
}: SidebarLabelProps) {
  // Track hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  // Determine if we're using CVS theme
  const isCvsTheme = themeName === "cvs";

  // Classes for active and inactive states
  const activeClasses = theme.active;
  const inactiveClasses = theme.inactive;

  // Hover classes that match the active state
  const hoverClasses = isCvsTheme
    ? "hover:bg-gradient-to-r hover:from-pastel-blue hover:to-pastel-red hover:text-gray-800"
    : "hover:bg-pastel-blue hover:text-gray-800";

  // For server-side rendering or initial render, use a consistent non-collapsed layout
  // This ensures hydration matches between server and client
  if (!isHydrated) {
    // Server-side consistent render
    const serverLinkClasses = cn(
      "flex items-center py-2 text-sm font-medium rounded-lg group px-3",
      isActive ? activeClasses : inactiveClasses,
      !isActive ? hoverClasses : "",
      "transition-all duration-200",
      className
    );

    const serverIconClasses = "w-5 h-5 mr-3 text-gray-500";

    return (
      <Link
        href={href}
        className={serverLinkClasses}
        title={title}
        onClick={onClick}
      >
        <Icon className={serverIconClasses} />
        <span className="group-hover:font-medium">{title}</span>
        {hasNotification && (
          <span className="bg-pastel-red text-red-600 text-xs rounded-full px-1.5 py-0.5 ml-auto">
            {notificationCount}
          </span>
        )}
      </Link>
    );
  }

  // After hydration, use the full dynamic rendering
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
    "flex items-center justify-between py-2 text-sm font-medium rounded-lg group w-full",
    isCollapsed ? "justify-center px-2" : "px-3",
    isActive ? activeClasses : inactiveClasses,
    !isActive ? hoverClasses : "",
    "transition-all duration-200",
    className // Add custom className
  );

  // Icon classes - use a consistent class string
  const iconClasses = cn(
    "w-5 h-5",
    isCollapsed ? "" : "mr-3",
    getIconClasses(),
    "transition-colors duration-200"
  );

  // Submenu classes for each submenu item
  const submenuItemClasses = (isItemActive: boolean) =>
    cn(
      "py-2 px-2 text-sm rounded-md transition-colors w-full block",
      isItemActive
        ? "text-primary font-medium bg-blue-50"
        : "text-gray-600 hover:bg-gray-100"
    );

  // Get left padding for submenu items to align with parent text
  const getSubmenuPadding = () => {
    // 20px = icon (w-5) + marginRight (mr-3)
    return isCollapsed ? "pl-2" : "pl-8";
  };

  // Handle the case when submenu is present
  if (hasSubmenu && !isCollapsed) {
    return (
      <div className="w-full">
        <div className={linkClasses}>
          <div className="flex items-center">
            <Icon className={iconClasses} />
            {!isCollapsed && <span className={getTextClasses()}>{title}</span>}
            {!isCollapsed && hasNotification && (
              <span className="bg-pastel-red text-red-600 text-xs rounded-full px-1.5 py-0.5 ml-2">
                {notificationCount}
              </span>
            )}
          </div>

          {/* Add submenu toggle button if hasSubmenu is true */}
          {!isCollapsed && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSubmenu?.();
              }}
              className="p-1 rounded-md"
              aria-label={`Toggle ${title} submenu`}
            >
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  isSubmenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Render submenu items */}
        {!isCollapsed && isSubmenuOpen && submenuItems && (
          <ul className={`mt-1 space-y-1 ${getSubmenuPadding()}`}>
            {submenuItems.map((item, index) => (
              <li key={`submenu-${index}`}>
                <Link
                  href={item.href}
                  className={submenuItemClasses(item.isActive)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Regular sidebar label without submenu
  return (
    <Link href={href} className={linkClasses} title={title} onClick={onClick}>
      <div className="flex items-center">
        <Icon className={iconClasses} />
        {!isCollapsed && <span className={getTextClasses()}>{title}</span>}
      </div>
      {!isCollapsed && hasNotification && (
        <span className="bg-pastel-red text-red-600 text-xs rounded-full px-1.5 py-0.5 ml-auto">
          {notificationCount}
        </span>
      )}
    </Link>
  );
}
