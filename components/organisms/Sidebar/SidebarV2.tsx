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
  ChevronDownIcon,
  ChevronUpIcon,
  TicketIcon,
  BuildingStorefrontIcon,
  ArrowRightOnRectangleIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { useDemoState } from "@/lib/redux/hooks";
import { toggleSidebar } from "@/lib/redux/slices/uiSlice";
import { logout } from "@/lib/redux/slices/userSlice";
import { buildDemoUrl, isPathActive } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import SidebarLabel from "./SidebarLabel";
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

// Navigation item types
export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavItem[];
  badge?: number | string;
  roles?: Array<"merchant" | "support" | "admin">;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
  roles?: Array<"merchant" | "support" | "admin">;
}

export interface SidebarV2Props {
  role?: "merchant" | "support" | "admin";
  isCVSContext?: boolean;
}

const SidebarV2 = ({
  role = "merchant",
  isCVSContext = false,
}: SidebarV2Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { clientId } = useSelector((state: RootState) => state.demo);
  const { clientName } = useDemoState();

  // State for sign out dialog, feedback modal, and hydration
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // State for expanded sections - load from localStorage
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kigoProSidebarExpandedSections");
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch {
          return new Set();
        }
      }
    }
    return new Set();
  });

  // Get pathname with fallback safely
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

  const isCVSContextBool = useMemo(() => {
    return Boolean(isCVSContext || clientId === "cvs");
  }, [isCVSContext, clientId]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Save expanded sections to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        "kigoProSidebarExpandedSections",
        JSON.stringify(Array.from(expandedSections))
      );
    }
  }, [expandedSections, isHydrated]);

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const handleToggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  // Check if link is active
  const isLinkActive = useCallback(
    (path: string): boolean => {
      if (
        path.includes("/analytics") &&
        (pathname.includes("/analytics") ||
          pathname.includes("/campaign-manager/analytics"))
      ) {
        return true;
      }

      if (
        path.includes("token-management") &&
        (pathname.includes("token-management") ||
          pathname.includes("cvs-token-management"))
      ) {
        return true;
      }

      if (
        path.includes("/campaigns/product-filters") &&
        pathname.includes("/campaigns/product-filters")
      ) {
        return true;
      }

      if (path === "/campaigns") {
        if (pathname.includes("/campaigns/product-filters")) {
          return false;
        }
        return (
          pathname === "/campaigns" ||
          (pathname.startsWith("/campaigns/") &&
            !pathname.includes("/campaigns/product-filters"))
        );
      }

      if (
        (path === "/" ||
          path.includes("/dashboard") ||
          path.includes("/campaign-manager")) &&
        (pathname === "/" ||
          pathname === "/demos/cvs-dashboard" ||
          pathname.includes("cvs-dashboard") ||
          pathname.includes("/campaign-manager"))
      ) {
        if (
          pathname.includes("/campaign-manager/ads-create") ||
          pathname.includes("/campaign-manager/ai-create") ||
          pathname.includes("/campaign-manager/campaign-create") ||
          pathname.includes("/campaign-manager/analytics")
        ) {
          return false;
        }
        return true;
      }

      if (
        path === "/campaigns" &&
        (pathname.includes("/campaign-manager/ads-create") ||
          pathname.includes("/campaign-manager/ai-create") ||
          pathname.includes("/campaign-manager/campaign-create"))
      ) {
        return true;
      }

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

  // Define navigation sections
  const navigationSections = useMemo((): NavSection[] => {
    if (isCVSContextBool) {
      return [
        {
          id: "overview",
          label: "Overview",
          items: [
            {
              id: "dashboard",
              label: "Dashboard",
              icon: HomeIcon,
              href: "/campaign-manager",
            },
          ],
        },
        {
          id: "cvs-main",
          label: "Main",
          items: [
            {
              id: "customers",
              label: "Customers",
              icon: UserGroupIcon,
              href: "/demos/cvs-token-management",
            },
            {
              id: "tokens",
              label: "Tokens",
              icon: (props) => (
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
              ),
              href: "/demos/cvs-token-catalog",
            },
            {
              id: "tickets",
              label: "Tickets",
              icon: TicketIcon,
              href: "/demos/cvs-tickets",
            },
          ],
        },
      ];
    }

    const overviewSection: NavSection = {
      id: "overview",
      label: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: HomeIcon,
          href: "/campaign-manager",
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: ChartBarIcon,
          href: "/analytics",
        },
      ],
    };

    const marketingSection: NavSection = {
      id: "marketing",
      label: "Marketing & Promotions",
      collapsible: true,
      defaultExpanded: true,
      items: [
        {
          id: "ad-manager",
          label: "Ad Manager",
          icon: MegaphoneIcon,
          href: "/campaigns",
          children: [
            {
              id: "program-ads",
              label: "Program Ads",
              icon: MegaphoneIcon,
              href: "/campaigns",
            },
            {
              id: "display-ads",
              label: "Display Ads",
              icon: MegaphoneIcon,
              href: "/campaigns/display",
            },
            {
              id: "ad-creation",
              label: "Ad Creation Wizard",
              icon: MegaphoneIcon,
              href: "/campaign-manager/ads-create",
            },
            {
              id: "ad-analytics",
              label: "Ad Analytics",
              icon: ChartBarIcon,
              href: "/campaigns/analytics",
            },
          ],
        },
        {
          id: "offer-manager",
          label: "Offer Manager",
          icon: GiftIcon,
          href: "/offer-manager",
          children: [
            {
              id: "active-offers",
              label: "Active Offers",
              icon: GiftIcon,
              href: "/offer-manager",
            },
            {
              id: "create-offer",
              label: "Create Offer",
              icon: GiftIcon,
              href: "/offer-manager?action=create",
            },
            {
              id: "offer-templates",
              label: "Offer Templates",
              icon: GiftIcon,
              href: "/offer-manager/templates",
            },
            {
              id: "redemption-tracking",
              label: "Redemption Tracking",
              icon: GiftIcon,
              href: "/offer-manager/redemptions",
            },
            {
              id: "offer-analytics",
              label: "Offer Analytics",
              icon: ChartBarIcon,
              href: "/offer-manager/analytics",
            },
          ],
        },
        {
          id: "campaigns",
          label: "Campaigns",
          icon: RectangleGroupIcon,
          href: "/campaign-management",
          children: [
            {
              id: "active-campaigns",
              label: "Active Campaigns",
              icon: RectangleGroupIcon,
              href: "/campaign-management",
            },
            {
              id: "create-campaign",
              label: "Create Campaign",
              icon: RectangleGroupIcon,
              href: "/campaign-management/create",
            },
            {
              id: "campaign-templates",
              label: "Campaign Templates",
              icon: RectangleGroupIcon,
              href: "/campaign-management/templates",
            },
            {
              id: "campaign-performance",
              label: "Campaign Performance",
              icon: ChartBarIcon,
              href: "/campaign-management/performance",
            },
          ],
        },
      ],
    };

    const businessOpsSection: NavSection = {
      id: "business-ops",
      label: "Business Operations",
      collapsible: true,
      items: [
        {
          id: "merchant-manager",
          label: "Merchant Manager",
          icon: BuildingStorefrontIcon,
          href: "/merchants",
          children: [
            {
              id: "merchant-directory",
              label: "Merchant Directory",
              icon: BuildingStorefrontIcon,
              href: "/merchants",
            },
            {
              id: "add-merchant",
              label: "Add New Merchant",
              icon: BuildingStorefrontIcon,
              href: "/merchants/create",
            },
            {
              id: "location-management",
              label: "Location Management",
              icon: BuildingStorefrontIcon,
              href: "/merchants/locations",
            },
            {
              id: "contracts",
              label: "Contracts & Agreements",
              icon: BuildingStorefrontIcon,
              href: "/merchants/contracts",
            },
            {
              id: "onboarding-pipeline",
              label: "Onboarding Pipeline",
              icon: BuildingStorefrontIcon,
              href: "/merchants/onboarding",
            },
            {
              id: "closure-detection",
              label: "Closure Detection",
              icon: BuildingStorefrontIcon,
              href: "/merchants/closures",
            },
          ],
        },
        {
          id: "catalog-filters",
          label: "Catalog Filters",
          icon: AdjustmentsHorizontalIcon,
          href: "/campaigns/product-filters",
        },
      ],
    };

    const customerEngagementSection: NavSection = {
      id: "customer-engagement",
      label: "Customer Engagement",
      collapsible: true,
      items: [
        {
          id: "customers",
          label: "Customers",
          icon: UserGroupIcon,
          href: "/customers",
          children: [
            {
              id: "customer-directory",
              label: "Customer Directory",
              icon: UserGroupIcon,
              href: "/customers",
            },
            {
              id: "segments",
              label: "Segments",
              icon: UserGroupIcon,
              href: "/customers/segments",
            },
            {
              id: "loyalty-programs",
              label: "Loyalty Programs",
              icon: UserGroupIcon,
              href: "/customers/loyalty",
            },
            {
              id: "customer-insights",
              label: "Customer Insights",
              icon: ChartBarIcon,
              href: "/customers/insights",
            },
          ],
        },
        {
          id: "tokens-rewards",
          label: "Tokens/Rewards",
          icon: (props) => (
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
          ),
          href: "/tokens",
          children: [
            {
              id: "token-management",
              label: "Token Management",
              icon: TicketIcon,
              href: "/tokens",
            },
            {
              id: "token-catalog",
              label: "Token Catalog",
              icon: TicketIcon,
              href: "/tokens/catalog",
            },
            {
              id: "redemption-history",
              label: "Redemption History",
              icon: TicketIcon,
              href: "/tokens/redemptions",
            },
          ],
        },
      ],
    };

    // Filter sections by role
    const sections = [overviewSection, marketingSection, businessOpsSection];

    if (role === "admin") {
      sections.push(customerEngagementSection);
    }

    return sections;
  }, [role, isCVSContextBool]);

  // Render navigation item (with or without children)
  const renderNavItem = useCallback(
    (item: NavItem, depth: number = 0) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedSections.has(item.id);
      const isActive = item.href ? isLinkActive(item.href) : false;

      if (hasChildren) {
        return (
          <li key={item.id} className="nav-item">
            <div
              className={`flex items-center justify-between px-3 py-1 cursor-pointer ${
                depth > 0 ? "pl-8" : ""
              }`}
              onClick={() => handleToggleSection(item.id)}
            >
              <SidebarLabel
                href={item.href || "#"}
                icon={item.icon}
                title={item.label}
                isActive={isActive}
                isCollapsed={sidebarCollapsed}
                onClick={(e) => {
                  if (hasChildren) {
                    e.preventDefault();
                  }
                }}
              />
              {!sidebarCollapsed && (
                <button
                  className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSection(item.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              )}
            </div>
            {isExpanded && !sidebarCollapsed && item.children && (
              <ul className="mt-1 space-y-1">
                {item.children.map((child) => renderNavItem(child, depth + 1))}
              </ul>
            )}
          </li>
        );
      }

      return (
        <li
          key={item.id}
          className={`nav-item px-3 py-1 ${depth > 0 ? "pl-8" : ""}`}
        >
          <SidebarLabel
            href={item.href || "#"}
            icon={item.icon}
            title={item.label}
            isActive={isActive}
            isCollapsed={sidebarCollapsed}
          />
        </li>
      );
    },
    [expandedSections, isLinkActive, sidebarCollapsed, handleToggleSection]
  );

  // Render section
  const renderSection = useCallback(
    (section: NavSection) => {
      const isSectionExpanded = expandedSections.has(section.id);

      return (
        <div key={section.id} className="mb-6">
          {!sidebarCollapsed && section.collapsible && (
            <div
              className="flex items-center justify-between px-5 mb-2 cursor-pointer"
              onClick={() => handleToggleSection(section.id)}
            >
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                {section.label}
              </p>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                {isSectionExpanded ? (
                  <ChevronUpIcon className="w-3.5 h-3.5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500" />
                )}
              </button>
            </div>
          )}
          {!sidebarCollapsed && !section.collapsible && (
            <p className="text-xs font-medium text-text-muted px-5 uppercase tracking-wider mb-2">
              {section.label}
            </p>
          )}
          {(!section.collapsible || isSectionExpanded || sidebarCollapsed) && (
            <ul className="nav-items w-full">
              {section.items.map((item) => renderNavItem(item))}
            </ul>
          )}
        </div>
      );
    },
    [expandedSections, sidebarCollapsed, handleToggleSection, renderNavItem]
  );

  const roleTitle = useMemo(() => {
    const isPublisherDashboard = pathname.includes("/publisher-dashboard");
    if (isPublisherDashboard) return "Publisher";
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

  const handleSignOut = useCallback(() => {
    dispatch(logout());
    setSignOutDialogOpen(false);
    router.push("/sso/login");
  }, [dispatch, router]);

  const logoElement = useMemo(() => {
    if (!isHydrated) {
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

  const userProfileInfo = useMemo(() => {
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
          {navigationSections.map((section) => renderSection(section))}
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

export default SidebarV2;
