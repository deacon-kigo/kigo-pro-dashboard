import type {
  ComponentType,
  HTMLAttributeAnchorTarget,
  MouseEvent,
  SVGProps,
} from "react";

import Link from "@/components/prod/_runtime/link";
import { usePathname } from "@/components/prod/_runtime/navigation";

import { cn } from "@/components/prod/utils/cn";
import { noop } from "@/components/prod/utils/no-op";

import { useSidebarContext } from "../../hooks/use-sidebar-context";

interface BaseSidebarLabelProps {
  className?: string;
  hasNotification?: boolean;
  icon?: Icon;
  isActive?: boolean;
  notificationCount?: number;
  title: string;
}

type ButtonSidebarLabelProps = BaseSidebarLabelProps & {
  href?: undefined;
  onClick: (
    event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>
  ) => Promise<void> | void;
  target?: undefined;
};

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type LinkSidebarLabelProps = BaseSidebarLabelProps & {
  href: string;
  onClick?: (
    event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>
  ) => void;
  target?: HTMLAttributeAnchorTarget | undefined;
};

type SidebarLabelProps = ButtonSidebarLabelProps | LinkSidebarLabelProps;

const SidebarLabel = ({
  className,
  hasNotification,
  href,
  icon: Icon,
  isActive: isActiveProp,
  notificationCount,
  onClick: handleClick,
  target,
  title,
}: SidebarLabelProps) => {
  const { isCollapsed } = useSidebarContext();
  const pathname = usePathname();
  const isActive =
    isActiveProp ??
    (href && (pathname === href || pathname.startsWith(`${href}/`)));
  const linkClasses = cn(
    "flex items-center py-2 text-sm font-medium rounded-lg group h-10 w-full",
    isCollapsed ? "justify-center px-2" : "px-3",
    isActive
      ? "bg-pastel-blue text-gray-800"
      : "text-gray-500 hover:bg-pastel-blue hover:text-gray-800",
    "transition-all duration-200",
    className
  );
  const iconClasses = cn(
    "min-w-5 max-w-5 min-h-5 max-h-5",
    isCollapsed ? "" : "mr-3",
    isActive ? "text-primary" : "text-gray-500 group-hover:text-primary",
    "transition-colors duration-200"
  );

  const body = (
    <>
      {Icon && (
        <Icon
          aria-label={isCollapsed ? title : undefined}
          className={iconClasses}
          data-testid="sidebar-label-icon"
        />
      )}
      <span
        className={`text-nowrap ${isActive ? "font-medium" : "group-hover:font-medium"} ${isCollapsed ? "hidden" : "inline-block"}`}
      >
        {title}
      </span>
      {!isCollapsed && hasNotification && (
        <span
          aria-label="Notification Count"
          className="bg-pastel-red ml-auto rounded-full px-1.5 py-0.5 text-xs text-red-600"
        >
          {notificationCount}
        </span>
      )}
    </>
  );

  /*
   * Derive a kebab-case testId from the title so e2e tests can find
   * any sidebar item by a stable selector (e.g. "Sign Out" ->
   * "sidebar-sign-out"). Without this, sidebar buttons are only
   * targetable by title attribute or role+name — both brittle when
   * copy changes.
   */
  const testId = `sidebar-${title.toLowerCase().replace(/\s+/g, "-")}`;

  if (!href) {
    return (
      <button
        className={linkClasses}
        data-testid={testId}
        onClick={handleClick}
        title={title}
        type="button"
      >
        {body}
      </button>
    );
  }

  return (
    <Link
      className={linkClasses}
      data-testid={testId}
      href={href}
      onClick={handleClick ? (event) => handleClick(event) : noop}
      target={target}
      title={title}
    >
      {body}
    </Link>
  );
};

export { type ButtonSidebarLabelProps, SidebarLabel, type SidebarLabelProps };
