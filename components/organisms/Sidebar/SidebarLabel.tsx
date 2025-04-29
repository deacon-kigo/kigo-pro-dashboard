import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { themeConfigs } from "@/lib/redux/slices/uiSlice";

export interface SubmenuItem {
  href: string;
  title: string;
  isActive: boolean;
}

export interface SidebarLabelProps {
  href: string;
  icon: React.ElementType;
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
  // Validate that Icon is defined - MOVED BEFORE ANY HOOKS
  if (!Icon) {
    console.error("SidebarLabel: Icon prop is undefined");
    // Return a placeholder instead of null to maintain component structure
    return <div className="w-full"></div>;
  }

  // Track hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Get theme information directly from Redux
  const { clientId } = useSelector((state: RootState) => state.demo);

  // Memoize theme calculations
  const {
    themeName,
    theme,
    isCvsTheme,
    activeClasses,
    inactiveClasses,
    hoverClasses,
  } = useMemo(() => {
    const themeName = clientId === "cvs" ? "cvs" : "default";
    const theme =
      themeConfigs[themeName]?.sidebar?.item ||
      themeConfigs.default.sidebar.item;
    const isCvsTheme = themeName === "cvs";

    // Classes for active and inactive states
    const activeClasses = theme.active;
    const inactiveClasses = theme.inactive;

    // Hover classes that match the active state
    const hoverClasses = isCvsTheme
      ? "hover:bg-gradient-to-r hover:from-pastel-blue hover:to-pastel-red hover:text-gray-800"
      : "hover:bg-pastel-blue hover:text-gray-800";

    return {
      themeName,
      theme,
      isCvsTheme,
      activeClasses,
      inactiveClasses,
      hoverClasses,
    };
  }, [clientId]);

  // Memoize icon and text classes to prevent recalculation on every render
  const getIconClasses = useCallback(() => {
    if (isActive) {
      // For CVS, ensure icon is dark on the gradient background
      return isCvsTheme ? "text-gray-800" : theme.icon.active;
    } else {
      return `${theme.icon.inactive} ${isCvsTheme ? "group-hover:text-gray-800" : "group-hover:text-primary"}`;
    }
  }, [isActive, isCvsTheme, theme]);

  const getTextClasses = useCallback(() => {
    if (isActive) {
      // For CVS, ensure text is semibold when active
      return isCvsTheme ? "font-semibold" : theme.text.active;
    } else {
      return `${theme.text.inactive} ${isCvsTheme ? "group-hover:font-semibold" : "group-hover:font-medium"}`;
    }
  }, [isActive, isCvsTheme, theme]);

  // Memoize class calculations to prevent recalculation on every render
  const serverClasses = useMemo(() => {
    const serverLinkClasses = cn(
      "flex items-center py-2 text-sm font-medium rounded-lg group px-3 h-10",
      isActive ? activeClasses : inactiveClasses,
      !isActive ? hoverClasses : "",
      "transition-all duration-200",
      className
    );

    const serverIconClasses = "w-5 h-5 mr-3 text-gray-500";

    return { serverLinkClasses, serverIconClasses };
  }, [isActive, activeClasses, inactiveClasses, hoverClasses, className]);

  // Memoize client-side classes
  const clientClasses = useMemo(() => {
    // Combine all classes for the link
    const linkClasses = cn(
      "flex items-center justify-between py-2 text-sm font-medium rounded-lg group w-full h-10",
      isCollapsed ? "justify-center px-2" : "px-3",
      isActive ? activeClasses : inactiveClasses,
      !isActive ? hoverClasses : "",
      "transition-all duration-200",
      className
    );

    // Icon classes - use a consistent class string
    const iconClasses = cn(
      "w-5 h-5",
      isCollapsed ? "" : "mr-3",
      getIconClasses(),
      "transition-colors duration-200"
    );

    return { linkClasses, iconClasses };
  }, [
    isCollapsed,
    isActive,
    activeClasses,
    inactiveClasses,
    hoverClasses,
    className,
    getIconClasses,
  ]);

  // Handle submenu toggle in a way that prevents propagation - MOVED UP from conditional section
  const handleSubmenuToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleSubmenu?.();
    },
    [onToggleSubmenu]
  );

  // Always compute all values regardless of hydration state
  const { serverLinkClasses, serverIconClasses } = serverClasses;
  const { linkClasses, iconClasses } = clientClasses;
  const textClasses = getTextClasses();

  // Use conditional rendering only for the returned JSX, not for hook calculation
  if (!isHydrated) {
    return (
      <div className="w-full">
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
      </div>
    );
  }

  // Handle the case when submenu is present
  return (
    <div className="w-full">
      <div className={linkClasses}>
        <div className="flex items-center">
          <Icon className={iconClasses} />
          {!isCollapsed && <span className={textClasses}>{title}</span>}
          {!isCollapsed && hasNotification && (
            <span className="bg-pastel-red text-red-600 text-xs rounded-full px-1.5 py-0.5 ml-2">
              {notificationCount}
            </span>
          )}
        </div>

        {/* Add submenu toggle button if hasSubmenu is true */}
        {!isCollapsed && hasSubmenu && (
          <button
            onClick={handleSubmenuToggle}
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
      {!isCollapsed && hasSubmenu && isSubmenuOpen && submenuItems && (
        <div className="pl-8 mt-1 relative">
          {/* Vertical line to connect parent and children */}
          <div
            className="absolute top-0 bottom-0 w-px bg-gray-200"
            style={{ left: "20px" }}
            aria-hidden="true"
          ></div>
          <ul className="space-y-1">
            {submenuItems.map((item, index) => (
              <li key={`submenu-${index}`}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 w-full",
                    item.isActive
                      ? activeClasses // Use same active classes as parent
                      : inactiveClasses, // Use same inactive classes as parent
                    !item.isActive ? hoverClasses : "" // Use same hover classes as parent
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
