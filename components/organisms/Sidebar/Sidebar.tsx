"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  MegaphoneIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TicketIcon,
  BuildingStorefrontIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  GiftIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { useDemoState } from "@/lib/redux/hooks";
import {
  toggleSidebar,
  setSidebarCollapsed,
  toggleChat,
} from "@/lib/redux/slices/uiSlice";
import { logout } from "@/lib/redux/slices/userSlice";
import { buildDemoUrl, isPathActive } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
// Import SidebarLabel component with standard path
import SidebarLabel from "./SidebarLabel";
// Import Dialog components for the confirmation
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/molecules/dialog";
import { Button } from "@/components/atoms/Button";
import FeedbackModal from "@/components/features/feedback/FeedbackModal";

// Ensure window type declaration for Storybook
declare global {
  interface Window {
    __NEXT_MOCK_PATHNAME?: string;
  }
}

export interface SidebarProps {
  role?: "merchant" | "support" | "admin";
  isCVSContext?: boolean;
}

const Sidebar = ({ role = "merchant", isCVSContext = false }: SidebarProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { clientId } = useSelector((state: RootState) => state.demo);
  const { clientName } = useDemoState();

  // State for sign out dialog, feedback modal, and hydration
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Get pathname with fallback safely, only run once when needed
  const rawPathname = usePathname();
  const pathname = useMemo(() => {
    if (rawPathname === null) {
      return (
        (typeof window !== "undefined" && window.__NEXT_MOCK_PATHNAME) ||
        "/dashboard"
      );
    }
    return rawPathname;
  }, [rawPathname]);

  // Determine if we're in campaign manager view based on pathname
  const isCampaignManagerView = pathname.includes("/campaign-manager");

  // Memoize the CVS context to avoid recalculations
  const isCVSContextBool = useMemo(() => {
    return Boolean(isCVSContext || clientId === "cvs");
  }, [isCVSContext, clientId]);

  useEffect(() => {
    // Mark component as hydrated once on first client render
    setIsHydrated(true);
  }, []);

  // Handle toggle sidebar click - memoize the handler
  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  // Memoize the isLinkActive function to prevent unnecessary recalculations
  const isLinkActive = useCallback(
    (path: string): boolean => {
      // Special case for analytics
      if (
        path.includes("/analytics") &&
        (pathname.includes("/analytics") ||
          pathname.includes("/campaign-manager/analytics"))
      ) {
        return true;
      }

      // Special case for token management
      if (
        path.includes("token-management") &&
        (pathname.includes("token-management") ||
          pathname.includes("cvs-token-management"))
      ) {
        return true;
      }

      // Special case for members
      if (
        path.includes("/dashboard/members") &&
        pathname.includes("/dashboard/members")
      ) {
        return true;
      }

      // Special case for product filters - CHECK THIS FIRST before general campaigns check
      if (
        path.includes("/campaigns/product-filters") &&
        pathname.includes("/campaigns/product-filters")
      ) {
        return true;
      }

      // Special case for campaigns - ensure /campaigns route is accessible
      // But exclude product filters (already handled above)
      if (path === "/campaigns") {
        if (pathname.includes("/campaigns/product-filters")) {
          return false; // Don't highlight campaigns when on product filters
        }
        return (
          pathname === "/campaigns" ||
          (pathname.startsWith("/campaigns/") &&
            !pathname.includes("/campaigns/product-filters"))
        );
      }

      // Special case for dashboard - now always campaign-manager
      if (
        (path === "/" ||
          path.includes("/dashboard") ||
          path.includes("/campaign-manager")) &&
        (pathname === "/" ||
          pathname === "/demos/cvs-dashboard" ||
          pathname.includes("cvs-dashboard") ||
          pathname.includes("/campaign-manager"))
      ) {
        // Don't highlight dashboard when on campaign creation pages or AI insights
        if (
          pathname.includes("/campaign-manager/ads-create") ||
          pathname.includes("/campaign-manager/ai-create") ||
          pathname.includes("/campaign-manager/campaign-create") ||
          pathname.includes("/campaign-manager/ai-insights") ||
          pathname.includes("/campaign-manager/analytics")
        ) {
          return false;
        }
        return true;
      }

      // Special case for campaigns - highlight when on campaign creation pages
      if (
        path === "/campaigns" &&
        (pathname.includes("/campaign-manager/ads-create") ||
          pathname.includes("/campaign-manager/ai-create") ||
          pathname.includes("/campaign-manager/campaign-create"))
      ) {
        return true;
      }

      // Special cases for other CVS pages
      if (isCVSContextBool) {
        if (path.includes("customers") && pathname.includes("customers"))
          return true;
        if (path.includes("tickets") && pathname.includes("tickets"))
          return true;
        if (path.includes("settings") && pathname.includes("settings"))
          return true;
      }

      return isPathActive(pathname, path);
    },
    [pathname, isCVSContextBool]
  );

  // Memoize navigation items based on context and role
  const navigationItems = useMemo(() => {
    // Always use campaign-manager as dashboard URL for consistency
    const dashboardUrl = "/campaign-manager";

    // Check if we're in the publisher dashboard view
    const isPublisherDashboard = pathname.includes("/publisher-dashboard");

    // If in CVS context, show CVS-specific navigation
    if (isCVSContextBool) {
      const cvsUrl = "/campaign-manager";
      const customersUrl = "/demos/cvs-token-management";
      const tokenManagementUrl = "/demos/cvs-token-catalog";
      const ticketsUrl = "/demos/cvs-tickets";

      return (
        <>
          <li className="nav-item px-3 py-1">
            <SidebarLabel
              href={cvsUrl}
              icon={HomeIcon}
              title="Dashboard"
              isActive={isLinkActive("/campaign-manager")}
              isCollapsed={sidebarCollapsed}
            />
          </li>
          <li className="nav-item px-3 py-1">
            <SidebarLabel
              href={customersUrl}
              icon={UserGroupIcon}
              title="Customers"
              isActive={isLinkActive(customersUrl)}
              isCollapsed={sidebarCollapsed}
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
              isActive={isLinkActive(tokenManagementUrl)}
              isCollapsed={sidebarCollapsed}
            />
          </li>
          <li className="nav-item px-3 py-1">
            <SidebarLabel
              href={ticketsUrl}
              icon={TicketIcon}
              title="Tickets"
              isActive={isLinkActive(ticketsUrl)}
              isCollapsed={sidebarCollapsed}
            />
          </li>
        </>
      );
    }

    switch (role) {
      case "merchant":
        return (
          <>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href={dashboardUrl}
                icon={HomeIcon}
                title="Dashboard"
                isActive={isLinkActive("/campaign-manager")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/campaigns"
                icon={MegaphoneIcon}
                title={
                  isPublisherDashboard ? "Program Ad Manager" : "Ad Manager"
                }
                isActive={isLinkActive("/campaigns")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/offer-manager"
                icon={GiftIcon}
                title="Offer Manager"
                isActive={isLinkActive("/offer-manager")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/campaign-management"
                icon={RectangleGroupIcon}
                title="Campaigns"
                isActive={isLinkActive("/campaign-management")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            {/* AI Insights - Hidden from sidebar (demo feature, accessible via direct URL) */}
            {/* <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/campaign-manager/ai-insights"
                icon={SparklesIcon}
                title="AI Insights"
                isActive={isLinkActive("/campaign-manager/ai-insights")}
                isCollapsed={sidebarCollapsed}
              />
            </li> */}
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/campaigns/product-filters"
                icon={AdjustmentsHorizontalIcon}
                title="Catalog Filters"
                isActive={isLinkActive("/campaigns/product-filters")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/analytics"
                icon={ChartBarIcon}
                title="Analytics"
                isActive={isLinkActive("/analytics")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/dashboard/members"
                icon={UserGroupIcon}
                title="Members"
                isActive={isLinkActive("/dashboard/members")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
          </>
        );
      case "support":
        return (
          <>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href={dashboardUrl}
                icon={HomeIcon}
                title="Dashboard"
                isActive={isLinkActive("/campaign-manager")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/tickets"
                icon={TicketIcon}
                title="Tickets"
                isActive={isLinkActive("/tickets")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/merchants"
                icon={BuildingStorefrontIcon}
                title="Merchants"
                isActive={isLinkActive("/merchants")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
          </>
        );
      case "admin":
        return (
          <>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href={dashboardUrl}
                icon={HomeIcon}
                title="Dashboard"
                isActive={isLinkActive("/campaign-manager")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/campaigns"
                icon={MegaphoneIcon}
                title={
                  isPublisherDashboard ? "Program Ad Manager" : "Ad Manager"
                }
                isActive={isLinkActive("/campaigns")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/offer-manager"
                icon={GiftIcon}
                title="Offer Manager"
                isActive={isLinkActive("/offer-manager")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/campaign-management"
                icon={RectangleGroupIcon}
                title="Campaigns"
                isActive={isLinkActive("/campaign-management")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            {/* AI Insights - Hidden from sidebar (demo feature, accessible via direct URL) */}
            {/* <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/campaign-manager/ai-insights"
                icon={SparklesIcon}
                title="AI Insights"
                isActive={isLinkActive("/campaign-manager/ai-insights")}
                isCollapsed={sidebarCollapsed}
              />
            </li> */}
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/campaigns/product-filters"
                icon={AdjustmentsHorizontalIcon}
                title="Catalog Filters"
                isActive={isLinkActive("/campaigns/product-filters")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/merchants"
                icon={UserGroupIcon}
                title="Merchants"
                isActive={isLinkActive("/merchants")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
            <li className="nav-item px-3 py-1">
              <SidebarLabel
                href="/analytics"
                icon={ChartBarIcon}
                title="Analytics"
                isActive={isLinkActive("/analytics")}
                isCollapsed={sidebarCollapsed}
              />
            </li>
          </>
        );
      default:
        return null;
    }
  }, [isCVSContextBool, role, sidebarCollapsed, isLinkActive, pathname]);

  // Memoize the role title
  const roleTitle = useMemo(() => {
    // Check if we're in the publisher dashboard view
    const isPublisherDashboard = pathname.includes("/publisher-dashboard");

    if (isPublisherDashboard) {
      return "Publisher";
    }

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
  }, [role, pathname]);

  // Handle sign out - memoize the handler
  const handleSignOut = useCallback(() => {
    dispatch(logout());
    setSignOutDialogOpen(false);
    router.push("/sso/login");
  }, [dispatch, router]);

  // Memoize logo rendering to prevent unnecessary recreation
  const logoElement = useMemo(() => {
    if (!isHydrated) {
      // Server-side rendering
      return (
        <Link href="/" className="flex items-center">
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
        </Link>
      );
    }

    if (sidebarCollapsed) {
      return (
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
                src="/kigo logo only.svg"
                alt={clientName || "Kigo"}
                width={36}
                height={36}
                className="transition-all duration-300 ease-in-out"
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
        </Link>
      );
    }

    return (
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
    );
  }, [isHydrated, sidebarCollapsed, isCVSContextBool, clientName]);

  // Memoize settings items to avoid recreating on every render
  const settingsItems = useMemo(() => {
    const settingsUrl = isCVSContextBool
      ? buildDemoUrl("cvs", "settings")
      : "/settings";

    return (
      <>
        <li className="nav-item px-3 py-1">
          <SidebarLabel
            href={settingsUrl}
            icon={Cog6ToothIcon}
            title="Settings"
            isActive={isLinkActive(settingsUrl)}
            isCollapsed={sidebarCollapsed}
          />
        </li>
        <li className="nav-item px-3 py-1">
          <SidebarLabel
            href="/notifications"
            icon={BellIcon}
            title="Notifications"
            isActive={isLinkActive("/notifications")}
            isCollapsed={sidebarCollapsed}
            hasNotification={true}
            notificationCount={5}
          />
        </li>
        <li className="nav-item px-3 py-1">
          <SidebarLabel
            href="#"
            icon={ChatBubbleLeftRightIcon}
            title="Feedback"
            isActive={false}
            isCollapsed={sidebarCollapsed}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              setFeedbackModalOpen(true);
            }}
          />
        </li>
        {/* <li className="nav-item px-3 py-1">
          <SidebarLabel
            href="#"
            icon={SparklesIcon}
            title="AI Assistant"
            isActive={false}
            isCollapsed={sidebarCollapsed}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              dispatch(toggleChat());
            }}
          />
        </li> */}
        <li className="nav-item px-3 py-1">
          <SidebarLabel
            href="https://augeoaffinitymarketing.sharepoint.com/:w:/r/sites/Heaps/_layouts/15/Doc.aspx?sourcedoc=%7Bc80d3798-caf2-4ee0-9c36-efafdd44497e%7D&action=edit&wdPreviousSession=32cf0f93-8f07-7682-4ad0-2e9fb5cdd368"
            icon={QuestionMarkCircleIcon}
            title="Help & Support"
            isActive={false}
            isCollapsed={sidebarCollapsed}
          />
        </li>
        <li className="nav-item px-3 py-1">
          <Dialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
            <DialogTrigger asChild>
              <div className="w-full">
                <SidebarLabel
                  href="#"
                  icon={ArrowRightOnRectangleIcon}
                  title="Sign Out"
                  isActive={false}
                  isCollapsed={sidebarCollapsed}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    setSignOutDialogOpen(true);
                  }}
                  className="text-red-600 hover:text-red-700"
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign Out Confirmation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to sign out of your account?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 mt-4">
                <Button
                  onClick={() => setSignOutDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={handleSignOut} variant="destructive">
                  Sign Out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </li>
      </>
    );
  }, [
    isCVSContextBool,
    sidebarCollapsed,
    isLinkActive,
    signOutDialogOpen,
    handleSignOut,
  ]);

  // User profile info - memoized
  const userProfileInfo = useMemo(() => {
    // Check if we're in the publisher dashboard view
    const isPublisherDashboard = pathname.includes("/publisher-dashboard");

    const avatar = (
      <div className="w-9 h-9 bg-pastel-purple rounded-full flex items-center justify-center text-indigo-500 font-semibold text-sm shadow-sm">
        {isCVSContextBool
          ? "SJ"
          : isPublisherDashboard
            ? "PU"
            : role === "merchant"
              ? "MU"
              : role === "support"
                ? "SA"
                : "AD"}
      </div>
    );

    if (sidebarCollapsed || !isHydrated) {
      return avatar;
    }

    return (
      <>
        {avatar}
        <div className="ml-3 overflow-hidden">
          <p className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {isCVSContextBool
              ? "Sarah Johnson"
              : isPublisherDashboard
                ? "Publisher User"
                : role === "merchant"
                  ? "Merchant User"
                  : role === "support"
                    ? "Support Agent"
                    : "Admin User"}
          </p>
          <p className="text-xs text-text-muted">
            {isCVSContextBool ? "CVS Agent ID: 2358" : roleTitle}
          </p>
        </div>
      </>
    );
  }, [
    isCVSContextBool,
    role,
    sidebarCollapsed,
    isHydrated,
    roleTitle,
    pathname,
  ]);

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen border-r border-border-light bg-white
        transition-all duration-300 ease-in-out z-40
        ${sidebarCollapsed ? "w-[70px]" : "w-[225px]"}
      `}
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
        willChange: "width",
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo section */}
        <div
          className={`
            flex items-center h-[64px] px-4 transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? "justify-center" : ""}
          `}
        >
          {logoElement}
        </div>

        {/* Collapse/expand button */}
        {isHydrated && (
          <button
            onClick={handleToggleSidebar}
            className="absolute top-24 -right-3 transform -translate-y-1/2 bg-white border border-border-light rounded-full p-1.5 shadow-sm hover:bg-gray-50 z-50 transition-colors"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>
        )}

        {/* Navigation section */}
        <div className="mt-6 mb-6 flex-1 overflow-y-auto overflow-x-hidden">
          {!sidebarCollapsed && isHydrated && (
            <p className="text-xs font-medium text-text-muted px-5 uppercase tracking-wider mb-2">
              {role === "merchant" ? "Business" : "Main"}
            </p>
          )}
          <ul className="nav-items w-full">{navigationItems}</ul>
        </div>

        {/* Settings section */}
        <div className="mb-4 overflow-x-hidden">
          {!sidebarCollapsed && isHydrated && (
            <p className="text-xs font-medium text-text-muted px-5 uppercase tracking-wider mb-2">
              Settings
            </p>
          )}
          <ul className="nav-items w-full">{settingsItems}</ul>
        </div>

        {/* User profile section */}
        <div
          className={`mt-auto pt-4 ${isHydrated && sidebarCollapsed ? "px-3" : "px-5"} border-t border-border-light overflow-x-hidden`}
        >
          <div
            className={`flex items-center ${isHydrated && sidebarCollapsed ? "justify-center" : ""} pb-4`}
          >
            {userProfileInfo}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
