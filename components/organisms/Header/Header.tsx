/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { usePathname } from "next/navigation";
import {
  TicketIcon,
  MegaphoneIcon,
  GiftIcon,
  AdjustmentsHorizontalIcon,
  ClipboardDocumentCheckIcon,
  BuildingStorefrontIcon,
  ChevronDownIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useDemoState } from "@/lib/redux/hooks";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Header() {
  const pathname = usePathname() || ""; // Add fallback for Storybook/test environments

  // Get demo state from Redux using our custom hook
  const { role, clientId, themeMode } = useDemoState();

  // Get UI state from Redux
  const { sidebarCollapsed, chatOpen, chatWidth } = useAppSelector(
    (state) => state.ui
  );
  const sidebarWidth = sidebarCollapsed ? "70px" : "225px";

  // Calculate header positioning accounting for both sidebar and chat
  const headerStyle = {
    left: sidebarWidth,
    width: chatOpen
      ? `calc(100% - ${sidebarWidth} - ${chatWidth}px)`
      : `calc(100% - ${sidebarWidth})`,
  };

  // Check if we're in the CVS context
  const isCVSContext =
    clientId === "cvs" || (pathname && pathname.includes("cvs-"));

  // Role-based quick actions surfaced through the header dropdown.
  // The first item in each list is the primary/default action.
  const getQuickActions = (): {
    primary: QuickAction;
    secondary: QuickAction[];
  } | null => {
    switch (role) {
      case "merchant":
        return {
          primary: {
            label: "New Campaign",
            href: "/campaign-manager/ads-create",
            icon: MegaphoneIcon,
          },
          secondary: [
            {
              label: "New Offer",
              href: "/offer-manager?action=create",
              icon: GiftIcon,
            },
            {
              label: "New Catalog Filter",
              href: "/campaigns/product-filters/new",
              icon: AdjustmentsHorizontalIcon,
            },
          ],
        };
      case "support":
        return {
          primary: {
            label: "New Ticket",
            href: "/tickets/create",
            icon: TicketIcon,
          },
          secondary: [
            {
              label: "New Manual Review",
              href: "/manual-review?action=create",
              icon: ClipboardDocumentCheckIcon,
            },
          ],
        };
      case "admin":
        return {
          primary: {
            label: "Add Merchant",
            href: "/merchants/create",
            icon: BuildingStorefrontIcon,
          },
          secondary: [
            {
              label: "New Campaign",
              href: "/campaign-manager/ads-create",
              icon: MegaphoneIcon,
            },
            {
              label: "New Offer",
              href: "/offer-manager?action=create",
              icon: GiftIcon,
            },
            {
              label: "New Catalog Filter",
              href: "/campaigns/product-filters/new",
              icon: AdjustmentsHorizontalIcon,
            },
            {
              label: "New Manual Review",
              href: "/manual-review?action=create",
              icon: ClipboardDocumentCheckIcon,
            },
          ],
        };
      default:
        return null;
    }
  };

  const getActionButton = () => {
    if (pathname && pathname.includes("/create")) return null;
    if (isCVSContext) return null;

    const actions = getQuickActions();
    if (!actions) return null;

    const allActions = [actions.primary, ...actions.secondary];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm outline outline-1 outline-[#ffffff1a] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 data-[state=open]:bg-primary/90"
          >
            <BoltIcon className="w-5 h-5" />
            Quick Action
            <ChevronDownIcon
              className="w-4 h-4 -mr-1 opacity-80 transition-transform duration-200 data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allActions.map((action) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem key={action.href} asChild>
                <Link href={action.href} className="cursor-pointer">
                  <Icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const isDarkMode = themeMode === "dark";

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
        <div className="ml-auto flex items-center gap-4">
          {getActionButton()}
        </div>
      </div>
    </header>
  );
}
