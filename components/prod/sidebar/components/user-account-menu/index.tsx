"use client";

import type { Role } from "@/components/prod/utils/session/store/types";

import {
  ArrowRightStartOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  ChevronUpDownIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "@/components/prod/_runtime/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/prod/dropdown";
import { ROUTES } from "@/components/prod/constants/routes";
import { cn } from "@/components/prod/utils/cn";

import { useSidebarContext } from "../../hooks/use-sidebar-context";
import { getInitials } from "../../utils/get-initials";
import { UserAccount } from "../user-account";

interface UserAccountMenuProps {
  onFeedbackClick: () => void;
  onSignOutClick: () => void;
  userName: string;
  userRole: Role;
}

const UserAccountMenu = ({
  onFeedbackClick,
  onSignOutClick,
  userName,
  userRole,
}: UserAccountMenuProps) => {
  const { isCollapsed } = useSidebarContext();

  const handleFeedbackSelect = () => {
    onFeedbackClick();
  };

  const handleSignOutSelect = () => {
    onSignOutClick();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-md p-1 transition-colors hover:bg-gray-50",
            isCollapsed ? "justify-center" : "justify-between"
          )}
          data-testid="user-account-menu-trigger"
          type="button"
        >
          <UserAccount userName={userName} userRole={userRole} />
          {!isCollapsed && (
            <ChevronUpDownIcon
              aria-hidden
              className="text-text-muted size-4 shrink-0"
            />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
        side="top"
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <div
            className="bg-pastel-purple flex max-h-9 min-h-9 max-w-9 min-w-9 items-center justify-center rounded-full text-sm font-semibold text-indigo-500 shadow-sm"
            data-testid="user-account-menu-avatar"
          >
            {getInitials(userName)}
          </div>
          <div className="overflow-hidden">
            <p className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
              {userName}
            </p>
            <p className="text-text-muted text-xs">{userRole}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          data-testid="user-account-menu-feedback"
          onSelect={handleFeedbackSelect}
        >
          <ChatBubbleLeftRightIcon />
          <span>Feedback</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild data-testid="user-account-menu-help">
          <Link href={ROUTES.external.help} target="_blank">
            <QuestionMarkCircleIcon />
            <span>Help &amp; Support</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          data-testid="user-account-menu-sign-out"
          onSelect={handleSignOutSelect}
        >
          <ArrowRightStartOnRectangleIcon />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserAccountMenu };
