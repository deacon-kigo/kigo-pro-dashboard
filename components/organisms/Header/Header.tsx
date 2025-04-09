/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftEllipsisIcon,
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
import { Button } from "@/components/ui/button";

export default function Header() {
  // Use Redux hooks directly
  const dispatch = useAppDispatch();
  const pathname = usePathname() || ""; // Add fallback for Storybook/test environments
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Get demo state from Redux using our custom hook
  const { role, clientId, themeMode, clientName } = useDemoState();

  // Get UI state from Redux
  const { isMobileView, sidebarCollapsed } = useAppSelector(
    (state) => state.ui
  );
  const sidebarWidth = sidebarCollapsed ? "70px" : "225px";

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
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-40 animate-rainbow-border blur-[1px]"></div>
            <Button
              asChild
              className="relative z-10 bg-primary text-primary-foreground shadow-md transition-all duration-500 ease-in-out
              before:absolute before:content-[''] before:-z-10 before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity before:duration-500 
              hover:before:opacity-100 before:bg-gradient-to-r before:from-primary/30 before:via-blue-500/20 before:to-purple-500/30 before:blur-xl before:animate-spin-slow"
            >
              <Link href={buildDemoUrl("deacons", "ai-campaign-creation")}>
                <PlusIcon className="w-5 h-5 mr-1 inline-block" />
                <span>New Campaign</span>
              </Link>
            </Button>
          </div>
        );
      case "support":
        return (
          <Button asChild variant="default">
            <Link href="/tickets/create">
              <TicketIcon className="w-5 h-5 mr-1 inline-block" />
              <span>New Ticket</span>
            </Link>
          </Button>
        );
      case "admin":
        return (
          <Button asChild variant="default">
            <Link href="/merchants/create">
              <PlusCircleIcon className="w-5 h-5 mr-1 inline-block" />
              <span>Add Merchant</span>
            </Link>
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
      className={`h-[72px] flex items-center px-8 fixed top-0 right-0 z-30 transition-all duration-300 ease-in-out border-b border-border-light`}
      style={{
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth})`,
      }}
    >
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-900/90 via-gray-800/5 to-gray-700/10"
            : isCVSContext
              ? "bg-gradient-to-r from-blue-50 via-blue-50/80 to-red-50/70 backdrop-blur-sm"
              : "bg-gradient-to-r from-white/90 via-pastel-blue/5 to-pastel-purple/10"
        } backdrop-blur-md`}
      ></div>

      <div className="relative z-10 flex items-center w-full max-w-[1600px] mx-auto">
        {/* Removing the Support text as requested */}

        <div id="search-container" className="relative ml-4 flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}
            />
          </div>
          <input
            type="text"
            className={`block w-full pl-10 pr-3 py-2 border ${isDarkMode ? "border-gray-700 bg-gray-800/80 focus:ring-blue-500/20 focus:border-blue-500 text-white" : "border-gray-200 bg-white/80 focus:ring-primary/20 focus:border-primary text-gray-900"} rounded-lg focus:outline-none focus:ring-2 text-sm`}
            placeholder={
              isCVSContext
                ? "Search tokens, customers, tickets..."
                : getSearchPlaceholder()
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
          />

          {/* AI Search Dropdown */}
          {showSearchDropdown && (
            <div
              className={`absolute top-full left-0 right-0 mt-1 ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg ${isDarkMode ? "border-gray-700" : "border-gray-200"} border overflow-hidden z-50 animate-fadeIn`}
            >
              <div
                className={`p-3 ${isDarkMode ? "border-gray-700" : "border-gray-100"} border-b`}
              >
                <p
                  className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-text-muted"}`}
                >
                  AI Suggestions
                </p>
              </div>
              <ul>
                {searchSuggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      className={`w-full px-4 py-2.5 text-left ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} flex items-center`}
                    >
                      <span className="w-6 h-6 flex items-center justify-center text-lg mr-3">
                        {suggestion.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${isDarkMode ? "text-gray-200" : "text-text-dark"}`}
                        >
                          {suggestion.text}
                        </p>
                        <p
                          className={`text-xs ${isDarkMode ? "text-gray-400" : "text-text-muted"} capitalize`}
                        >
                          {suggestion.type}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div
                className={`p-2 ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-100"} border-t`}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs ${isDarkMode ? "text-gray-400" : "text-text-muted"}`}
                  >
                    Powered by AI
                  </p>
                  <button
                    className={`text-xs ${isDarkMode ? "text-blue-400" : "text-primary"} font-medium`}
                  >
                    Search all results
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? "hover:bg-gray-800/80" : "hover:bg-white/80"}`}
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
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? "hover:bg-gray-800/80" : "hover:bg-white/80"}`}
          >
            <ChatBubbleLeftEllipsisIcon
              className={`h-5 w-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            />
          </button>

          {getActionButton()}
        </div>
      </div>
    </header>
  );
}
