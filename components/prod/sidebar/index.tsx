"use client";

import type { NavGroup as NavGroupId } from "@/components/prod/shell/shared/types/module";
import type { Role } from "@/components/prod/utils/session/store/types";

import { useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { setCookie } from "@/components/prod/_runtime/cookies";
import Image from "next/image";
import Link from "@/components/prod/_runtime/link";
import { usePathname } from "@/components/prod/_runtime/navigation";

import { signOut } from "@/components/prod/actions/sign-out";
import { Button } from "@/components/prod/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/prod/dialog";
import { COOKIE_NAMES } from "@/components/prod/constants/cookies";
import { ROUTES } from "@/components/prod/constants/routes";

import { NavGroup } from "./atoms/nav-group";
import { FeedbackDialog } from "./components/feedback-dialog";
import { UserAccountMenu } from "./components/user-account-menu";
import { NAV_GROUPS } from "./constants";
import { SidebarContext } from "./context";
import { serializeCollapsedGroups } from "./utils/collapsed-groups";
import { getNavigationItems } from "./utils/get-navigation-items";

interface SidebarProps {
  initiallyCollapsedGroups: NavGroupId[];
  isInitiallyCollapsed: boolean;
  userName: string;
  userRole: Role;
}

const isActiveHref = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const Sidebar = ({
  initiallyCollapsedGroups,
  isInitiallyCollapsed,
  userName,
  userRole,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(isInitiallyCollapsed);
  const [collapsedGroups, setCollapsedGroups] = useState<NavGroupId[]>(
    initiallyCollapsedGroups
  );
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const navigationItems = getNavigationItems(userRole);
  const pathname = usePathname();

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    void setCookie(COOKIE_NAMES.sidebarIsCollapsed, !isCollapsed);
  };

  const handleToggleGroup = (group: NavGroupId) => {
    const nextCollapsedGroups = collapsedGroups.includes(group)
      ? collapsedGroups.filter((collapsedGroup) => collapsedGroup !== group)
      : [...collapsedGroups, group];

    setCollapsedGroups(nextCollapsedGroups);
    void setCookie(
      COOKIE_NAMES.sidebarCollapsedGroups,
      serializeCollapsedGroups(nextCollapsedGroups)
    );
  };

  const handleToggleSignOutDialog = () => {
    setIsSignOutDialogOpen(!isSignOutDialogOpen);
  };

  const handleSignOut = () => {
    setIsSignOutDialogOpen(false);
    void signOut();
  };

  const handleToggleFeedbackDialog = () => {
    setIsFeedbackDialogOpen(!isFeedbackDialogOpen);
  };

  return (
    <>
      <div>
        <div
          className={`transition-all duration-300 ease-in-out ${isCollapsed ? "w-[70px]" : "w-[225px]"}`}
        />
        <aside
          className={`border-border-light shadow-sidebar fixed top-0 left-0 z-40 h-screen border-r bg-white transition-all duration-300 ease-in-out ${isCollapsed ? "w-[70px]" : "w-[225px]"} `}
        >
          <SidebarContext.Provider value={{ isCollapsed }}>
            <nav className="flex h-full flex-col">
              <div
                className={`flex h-[64px] items-center px-4 transition-all duration-300 ease-in-out ${isCollapsed ? "justify-center" : ""} `}
              >
                <Link href={ROUTES.web.dashboard}>
                  <Image
                    alt="Kigo Isotype"
                    className={`object-contain ${isCollapsed ? "" : "hidden"}`}
                    height={36}
                    priority
                    src="/kigo-isotype.svg"
                    width={36}
                  />
                </Link>

                <Link href={ROUTES.web.dashboard}>
                  <Image
                    alt="Kigo Logo"
                    className={`object-contain ${isCollapsed ? "hidden" : ""}`}
                    height={40}
                    priority
                    src="/kigo-logo.svg"
                    width={100}
                  />
                </Link>
              </div>

              <button
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="border-border-light absolute top-24 -right-3 z-50 -translate-y-1/2 transform rounded-full border bg-white p-1.5 text-gray-500 shadow-xs transition-colors hover:bg-gray-50"
                onClick={handleToggleSidebar}
                type="button"
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="size-3.5" />
                ) : (
                  <ChevronLeftIcon className="size-3.5" />
                )}
              </button>

              <div className="mt-6 mb-6 flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto">
                {NAV_GROUPS.map(({ id, label }) => {
                  const items = navigationItems[id];

                  if (items.length === 0) {
                    return null;
                  }

                  return (
                    <NavGroup
                      id={id}
                      isActive={items.some((item) =>
                        isActiveHref(pathname, item.href)
                      )}
                      isExpanded={!collapsedGroups.includes(id)}
                      items={items}
                      key={id}
                      label={label}
                      onToggle={handleToggleGroup}
                    />
                  );
                })}
              </div>

              <div
                className={`border-border-light border-t py-4 ${isCollapsed ? "px-3" : "px-5"}`}
              >
                <UserAccountMenu
                  onFeedbackClick={handleToggleFeedbackDialog}
                  onSignOutClick={handleToggleSignOutDialog}
                  userName={userName}
                  userRole={userRole}
                />
              </div>
            </nav>
          </SidebarContext.Provider>
        </aside>
      </div>

      <FeedbackDialog
        isOpen={isFeedbackDialogOpen}
        onToggleOpen={handleToggleFeedbackDialog}
      />

      <Dialog
        onOpenChange={handleToggleSignOutDialog}
        open={isSignOutDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              color="secondary"
              data-testid="sign-out-dialog-cancel"
              onClick={handleToggleSignOutDialog}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              color="destructive"
              data-testid="sign-out-dialog-confirm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { Sidebar };
