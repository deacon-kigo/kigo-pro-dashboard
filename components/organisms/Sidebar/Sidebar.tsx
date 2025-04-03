"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TicketIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { useDemoState } from "@/lib/redux/hooks";
import { toggleSidebar, setSidebarCollapsed } from "@/lib/redux/slices/uiSlice";
import { buildDemoUrl, isPathActive } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
// Import SidebarLabel component with standard path
import SidebarLabel from "./SidebarLabel";

export interface SidebarProps {
  role?: 'merchant' | 'support' | 'admin';
  isCVSContext?: boolean;
}

const Sidebar = ({ role = 'merchant', isCVSContext = false }: SidebarProps) => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { clientId } = useSelector((state: RootState) => state.demo);
  const { clientName } = useDemoState();

  // Local state for backward compatibility during migration
  const [isCollapsed, setIsCollapsed] = useState(sidebarCollapsed);

  // This is where the error occurs - pathname can be null in Storybook
  let pathname = usePathname();

  // Add a fallback for Storybook
  if (pathname === null) {
    // Check for a mocked pathname or use a default
    pathname =
      (typeof window !== "undefined" && window.__NEXT_MOCK_PATHNAME) ||
      "/dashboard";
  }

  // Ensure pathname is a string and never null
  pathname = pathname || "/dashboard";

  // Check if we're in the CVS context
  const isCVSContextBool = Boolean(isCVSContext);

  // CVS brand colors for gradients - removing since they're not used
  // const cvsBlue = '#2563EB';
  // const cvsRed = '#CC0000';

  // Define gradients - centralized for consistency
  const cvsPastelGradient = "bg-gradient-to-r from-pastel-blue to-pastel-red";
  const activeLinkBgGradient = cvsPastelGradient;
  const activeLinkTextGradient = "font-semibold";
  const activeIconClass = "text-gray-800";

  // Kigo brand colors - matched to CVS pattern but with solid blue
  const kigoActiveClass = "text-gray-800 font-medium"; // Dark text like CVS
  const kigoActiveBgClass = "bg-blue-100"; // Blue background for active items
  const kigoActiveIconClass = "text-primary"; // Blue icon for brand consistency
  const kigoInactiveClass = "text-gray-500"; // Gray text for inactive items

  // Get active state classes based on context
  const getActiveClasses = (isActive: boolean) => {
    if (!isActive) return kigoInactiveClass;

    return isCVSContextBool
      ? `${cvsPastelGradient} text-gray-800`
      : `${kigoActiveBgClass} ${kigoActiveClass}`;
  };

  // For hover classes
  const getHoverClasses = () => {
    return isCVSContextBool 
      ? `hover:${cvsPastelGradient} hover:text-gray-800`
      : "hover:bg-blue-100 hover:text-gray-800";
  };

  // Get active icon classes based on context
  const getActiveIconClasses = (isActive: boolean) => {
    if (!isActive) return "text-gray-500"; // Gray icon for inactive items

    return isCVSContextBool ? "text-gray-800" : kigoActiveIconClass;
  };

  // Get active text classes for span elements
  const getActiveTextClasses = (isActive: boolean) => {
    if (!isActive) return "";

    return isCVSContextBool ? activeLinkTextGradient : "font-medium";
  };

  // Sync local state with Redux
  useEffect(() => {
    setIsCollapsed(sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Store collapse state in localStorage (will be handled by Redux in the future)
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarCollapsed");
    if (storedState) {
      setIsCollapsed(storedState === "true");
      dispatch(setSidebarCollapsed(storedState === "true"));
    }
  }, [dispatch]);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());

    // Update the main content padding when sidebar collapses/expands
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "70px" : "225px"
    );
  }, [isCollapsed]);

  // Handle toggle sidebar click - update both local and Redux state
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    dispatch(toggleSidebar());
  };

  const isLinkActive = (path: string) => {
    // Special case for token management
    if (
      path.includes("token-management") &&
      pathname &&
      (pathname.includes("token-management") ||
        pathname.includes("cvs-token-management"))
    ) {
      return true;
    }
    // Special case for dashboard - when on root path or specific dashboard URL
    if (
      path.includes("/dashboard") &&
      (pathname === "/" ||
        pathname === "/demos/cvs-dashboard" ||
        pathname.includes("cvs-dashboard"))
    ) {
      return true;
    }

    // Special cases for other CVS pages
    if (isCVSContextBool) {
      if (
        path.includes("customers") &&
        pathname &&
        pathname.includes("customers")
      ) {
        return true;
      }
      if (
        path.includes("tickets") &&
        pathname &&
        pathname.includes("tickets")
      ) {
        return true;
      }
      if (
        path.includes("settings") &&
        pathname &&
        pathname.includes("settings")
      ) {
        return true;
      }
    }

    return isPathActive(pathname, path);
  };

  // Get CVS-specific navigation items
  const getCVSNavigationItems = () => {
    const dashboardUrl = buildDemoUrl("cvs", "dashboard");
    const customersUrl = buildDemoUrl("cvs", "token-management");
    const tokenManagementUrl = buildDemoUrl("cvs", "token-catalog");
    const ticketsUrl = buildDemoUrl("cvs", "tickets");

    // Cast isCVSContext to boolean explicitly for type safety
    // Adding separate variable with unique name to avoid scope issues
    const cvxContextBool = Boolean(isCVSContextBool);

    return (
      <>
        <li className="nav-item px-3 py-1">
          <SidebarLabel
            href={dashboardUrl}
            icon={HomeIcon}
            title="Dashboard"
            isActive={Boolean(isLinkActive(dashboardUrl))}
            isCollapsed={isCollapsed}
            isCVSContext={cvxContextBool}
          />
        </li>
        <li className="nav-item px-3 py-1">
          <SidebarLabel
            href={customersUrl}
            icon={UserGroupIcon}
            title="Customers"
            isActive={Boolean(isLinkActive(customersUrl))}
            isCollapsed={isCollapsed}
            isCVSContext={cvxContextBool}
          />
        </li>
        <li className="nav-item px-3 py-1">
          <SidebarLabel
            href={tokenManagementUrl}
            icon={(props) => (
              <svg
                {...props}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            )}
            title="Tokens"
            isActive={Boolean(isLinkActive(tokenManagementUrl))}
            isCollapsed={isCollapsed}
            isCVSContext={cvxContextBool}
          />
        </li>
        <li className="nav-item px-3 py-1">
          <SidebarLabel
            href={ticketsUrl}
            icon={TicketIcon}
            title="Tickets"
            isActive={Boolean(isLinkActive(ticketsUrl))}
            isCollapsed={isCollapsed}
            isCVSContext={cvxContextBool}
          />
        </li>
      </>
    );
  };

  // Role-specific navigation items
  const getNavigationItems = () => {
    // If in CVS context, show CVS-specific navigation
    if (isCVSContextBool) {
      return getCVSNavigationItems();
    }

    switch (role) {
      case "merchant":
        return (
          <>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/"
                icon={HomeIcon}
                title="Dashboard"
                isActive={Boolean(isLinkActive("/"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/campaigns"
                icon={RocketLaunchIcon}
                title="Campaigns"
                isActive={Boolean(isLinkActive("/campaigns"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/analytics"
                icon={ChartBarIcon}
                title="Analytics"
                isActive={Boolean(isLinkActive("/analytics"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
          </>
        );
      case "support":
        return (
          <>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/"
                icon={HomeIcon}
                title="Dashboard"
                isActive={Boolean(isLinkActive("/"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/tickets"
                icon={TicketIcon}
                title="Tickets"
                isActive={Boolean(isLinkActive("/tickets"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/merchants"
                icon={BuildingStorefrontIcon}
                title="Merchants"
                isActive={Boolean(isLinkActive("/merchants"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
          </>
        );
      case "admin":
        return (
          <>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/"
                icon={HomeIcon}
                title="Dashboard"
                isActive={Boolean(isLinkActive("/"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/merchants"
                icon={UserGroupIcon}
                title="Merchants"
                isActive={Boolean(isLinkActive("/merchants"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/analytics"
                icon={ChartBarIcon}
                title="Analytics"
                isActive={Boolean(isLinkActive("/analytics"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/settings"
                icon={Cog6ToothIcon}
                title="Settings"
                isActive={Boolean(isLinkActive("/settings"))}
                isCollapsed={isCollapsed}
                isCVSContext={isCVSContextBool}
              />
            </li>
          </>
        );
      default:
        return null;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case "merchant":
        return "Business Owner";
      case "support":
        return "Support Agent";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  };

  // Ensure consistent handling for CVS context detection
  useEffect(() => {
    // Special case to ensure all CVS pages use the same styling
    if (clientId === "cvs" && !isCVSContextBool) {
      console.log("Ensuring CVS context is active");
      // This log helps trace if there's any context issue
    }
  }, [clientId, isCVSContextBool]);

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen border-r border-border-light bg-white
        transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? "w-[70px]" : "w-[225px]"}
      `}
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo - Fixed height container with improved transitions */}
        <div
          className={`
            flex items-center h-[64px] px-4 transition-all duration-300 ease-in-out
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          {isCollapsed ? (
            <Link
              href="/"
              className="flex flex-col items-center justify-center w-full overflow-hidden"
            >
              {isCVSContextBool ? (
                <div className="relative flex items-center justify-center w-[40px] h-[40px] transition-all duration-300 ease-in-out overflow-hidden">
                  <Image
                    src="/logos/cvs-logo-only.svg"
                    alt="CVS"
                    width={24}
                    height={24}
                    className="absolute top-1 left-1 transition-all duration-300 ease-in-out"
                    style={{ objectFit: "contain" }}
                  />
                  <Image
                    src="/kigo logo only.svg"
                    alt="Kigo"
                    width={26}
                    height={26}
                    className="absolute bottom-1 right-1 transition-all duration-300 ease-in-out"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ) : (
                <div className="w-[40px] h-[40px] flex items-center justify-center overflow-hidden">
                  <Image
                    src={
                      isCVSContextBool
                        ? "/logos/cvs-logo-only.svg"
                        : "/kigo logo only.svg"
                    }
                    alt={clientName || "Kigo"}
                    width={36}
                    height={36}
                    className="transition-all duration-300 ease-in-out"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}
            </Link>
          ) : (
            <Link href="/" className="flex items-center">
              {isCVSContextBool ? (
                <div className="flex items-center p-1.5 relative max-w-[180px] overflow-hidden">
                  <div className="flex items-center z-10">
                    <Image
                      src="/logos/cvs-logo-only.svg"
                      alt="CVS Logo"
                      width={26}
                      height={26}
                      className="transition-all duration-300 ease-in-out"
                      style={{ objectFit: "contain" }}
                    />
                    <span className="mx-2 text-gray-300">|</span>
                    <Image
                      src="/kigo logo only.svg"
                      alt="Kigo Logo"
                      width={30}
                      height={30}
                      className="transition-all duration-300 ease-in-out"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-[100px] h-[40px] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/kigo logo.svg"
                    alt="Kigo Logo"
                    width={100}
                    height={40}
                    className="transition-all duration-300 ease-in-out"
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              )}
            </Link>
          )}
        </div>

        <button
          onClick={handleToggleSidebar}
          className="absolute top-24 -right-3 transform -translate-y-1/2 bg-white border border-border-light rounded-full p-1.5 shadow-sm hover:bg-gray-50 z-30 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>

        <div className="mt-6 mb-6 flex-1 overflow-y-auto">
          {!isCollapsed && (
            <p className="text-xs font-medium text-text-muted px-5 uppercase tracking-wider mb-2">
              {role === "merchant" ? "Business" : "Main"}
            </p>
          )}
          <ul className="nav-items">{getNavigationItems()}</ul>
        </div>

        <div className="mb-4">
          {!isCollapsed && (
            <p className="text-xs font-medium text-text-muted px-5 uppercase tracking-wider mb-2">
              Settings
            </p>
          )}
          <ul className="nav-items">
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href={isCVSContextBool ? buildDemoUrl("cvs", "settings") : "/settings"}
                icon={Cog6ToothIcon}
                title="Settings"
                isActive={Boolean(isLinkActive(isCVSContextBool ? buildDemoUrl("cvs", "settings") : "/settings"))}
                isCollapsed={isCollapsed}
                isCVSContext={Boolean(isCVSContextBool)}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/notifications"
                icon={BellIcon}
                title="Notifications"
                isActive={Boolean(isLinkActive("/notifications"))}
                isCollapsed={isCollapsed}
                isCVSContext={Boolean(isCVSContextBool)}
                hasNotification={true}
                notificationCount={5}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/help"
                icon={QuestionMarkCircleIcon}
                title="Help & Support"
                isActive={Boolean(isLinkActive("/help"))}
                isCollapsed={isCollapsed}
                isCVSContext={Boolean(isCVSContextBool)}
              />
            </li>
          </ul>
        </div>

        <div
          className={`mt-auto pt-4 ${isCollapsed ? "px-3" : "px-5"} border-t border-border-light`}
        >
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : ""} pb-6`}
          >
            <div className="w-9 h-9 bg-pastel-purple rounded-full flex items-center justify-center text-indigo-500 font-semibold text-sm shadow-sm">
              {isCVSContextBool
                ? "SJ"
                : role === "merchant"
                  ? "MU"
                  : role === "support"
                    ? "SA"
                    : "AD"}
            </div>
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {isCVSContextBool
                    ? "Sarah Johnson"
                    : role === "merchant"
                      ? "Merchant User"
                      : role === "support"
                        ? "Support Agent"
                        : "Admin User"}
                </p>
                <p className="text-xs text-text-muted">
                  {isCVSContextBool ? "CVS Agent ID: 2358" : getRoleTitle()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
