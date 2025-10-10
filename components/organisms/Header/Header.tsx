/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MagnifyingGlassIcon,
  BellIcon,
  PlusIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  TicketIcon,
  UserIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  useAppSelector,
  useAppDispatch,
  useDemoState,
} from "@/lib/redux/hooks";
import { toggleSidebar } from "@/lib/redux/slices/uiSlice";
import { markAllNotificationsAsRead } from "@/lib/redux/slices/userSlice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Input, SearchSuggestion } from "@/components/atoms/Input";

export default function Header() {
  // Use Redux hooks directly
  const dispatch = useAppDispatch();
  const pathname = usePathname() || ""; // Add fallback for Storybook/test environments
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Get demo state from Redux using our custom hook
  const { role, clientId, themeMode, clientName } = useDemoState();

  // Get UI state from Redux
  const { isMobileView, sidebarCollapsed, chatOpen, chatWidth } =
    useAppSelector((state) => state.ui);
  const sidebarWidth = sidebarCollapsed ? "70px" : "225px";

  // Calculate header positioning accounting for both sidebar and chat
  const headerStyle = {
    left: sidebarWidth,
    width: chatOpen
      ? `calc(100% - ${sidebarWidth} - ${chatWidth}px)`
      : `calc(100% - ${sidebarWidth})`,
  };

  // Get user state from Redux
  const { notifications } = useAppSelector((state) => state.user);
  const unreadNotificationsCount =
    notifications?.filter((n) => !n.read).length || 0;

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Check if we're in the CVS context
  const isCVSContext =
    clientId === "cvs" || (pathname && pathname.includes("cvs-"));

  // Helper function to build demo URLs
  const buildDemoUrl = (client: string, page: string) => {
    return `/demos/${client}/${page}`;
  };

  // Mock search suggestions - role-based
  const getSearchSuggestions = () => {
    switch (role) {
      case "merchant":
        return [
          { type: "campaign", text: "Summer Sale Promotion", icon: "🚀" },
          { type: "analytics", text: "Weekend performance report", icon: "📊" },
          { type: "recent", text: "Product inventory status", icon: "⏱️" },
          { type: "product", text: "Discount codes overview", icon: "🏷️" },
        ];
      case "support":
        return [
          { type: "ticket", text: "Merchant payment issue #1293", icon: "🎫" },
          { type: "merchant", text: "Acme Corporation", icon: "🏢" },
          { type: "recent", text: "Onboarding tutorials", icon: "⏱️" },
          { type: "knowledge", text: "Payment processing guide", icon: "📚" },
        ];
      case "admin":
        return [
          { type: "merchant", text: "Acme Corporation", icon: "🏢" },
          { type: "analytics", text: "Platform growth metrics", icon: "📊" },
          { type: "setting", text: "API configuration", icon: "⚙️" },
          { type: "user", text: "Support team member", icon: "👤" },
        ];
      default:
        return [
          { type: "campaign", text: "Summer Sale Promotion", icon: "🚀" },
          { type: "merchant", text: "Acme Corporation", icon: "🏢" },
          { type: "analytics", text: "Weekend performance report", icon: "📊" },
          { type: "recent", text: "ROI analysis", icon: "⏱️" },
        ];
    }
  };

  const searchSuggestions = getSearchSuggestions();

  // Handle search suggestion click
  const handleSearchSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    setShowSearchDropdown(false);
    // Additional logic for handling the search with the suggestion
  };

  // Handle search all results click
  const handleSearchAllResults = () => {
    setShowSearchDropdown(false);
    // Logic to search all results with current query
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById("search-container");
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get the appropriate action button based on role and client
  const getActionButton = () => {
    // Add defensive check for pathname in Storybook/test environments
    if (pathname && pathname.includes("/create")) return null;

    // Special handling for CVS context - always return null for CVS pages
    if (isCVSContext) {
      return null;
    }

    switch (role) {
      case "merchant":
        return (
          <Button
            variant="primary"
            href="/campaign-manager/ads-create"
            icon={<PlusIcon className="w-5 h-5" />}
            glow={{
              mode: "colorShift",
              colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#ef4444"],
              blur: "soft",
              scale: 0.95,
              duration: 3,
            }}
          >
            New Campaign
          </Button>
        );
      case "support":
        return (
          <Button
            variant="primary"
            href="/tickets/create"
            icon={<TicketIcon className="w-5 h-5" />}
            glow
          >
            New Ticket
          </Button>
        );
      case "admin":
        return (
          <Button
            variant="primary"
            href="/merchants/create"
            icon={<PlusCircleIcon className="w-5 h-5" />}
            glow
          >
            Add Merchant
          </Button>
        );
      default:
        return null;
    }
  };

  // Get search placeholder based on role
  const getSearchPlaceholder = () => {
    switch (role) {
      case "merchant":
        return "Search campaigns, products...";
      case "support":
        return "Search tickets, merchants...";
      case "admin":
        return "Search merchants, users...";
      default:
        return "Search...";
    }
  };

  const isDarkMode = themeMode === "dark";

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleToggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);

    // Mark all as read when opening
    if (!notificationsOpen && unreadNotificationsCount > 0) {
      dispatch(markAllNotificationsAsRead());
    }
  };

  const getMobileHeaderTitle = () => {
    switch (role) {
      case "merchant":
        return clientName || "Kigo Dashboard";
      case "support":
        return "Kigo Support Portal";
      case "admin":
        return "Kigo Admin Portal";
      default:
        return "Kigo PRO";
    }
  };

  return (
    <header
      className={`h-[72px] flex items-center px-6 fixed top-0 right-0 z-30 transition-all duration-300 ease-in-out border-b border-border-light`}
      style={headerStyle}
    >
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-900/95 via-gray-800/90 to-gray-700/85"
            : isCVSContext
              ? "bg-gradient-to-r from-blue-50 via-blue-50/80 to-red-50/70 backdrop-blur-sm"
              : "bg-gradient-to-r from-white/95 via-white/90 to-white/85"
        } backdrop-blur-md`}
      ></div>

      <div className="relative z-10 flex items-center w-full max-w-[1600px] mx-auto">
        {/* Removing the Support text as requested */}

        <div id="search-container" className="relative  flex-1 max-w-md">
          <Input
            variant="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder={
              isCVSContext
                ? "Search tokens, customers, tickets..."
                : getSearchPlaceholder()
            }
            suggestions={searchSuggestions}
            showSuggestions={showSearchDropdown}
            onSuggestionClick={handleSearchSuggestionClick}
            onSearchAllResults={handleSearchAllResults}
            isDarkMode={isDarkMode}
            className={
              isDarkMode
                ? "border-gray-700 bg-gray-800/80 text-white"
                : "border-gray-200 bg-white/80 text-gray-900"
            }
          />
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${isDarkMode ? "hover:bg-gray-800/80" : "hover:bg-white/80"}`}
          >
            <BellIcon
              className={`h-5 w-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {getActionButton()}
        </div>
      </div>
    </header>
  );
}
