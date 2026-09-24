"use client";

import type { NavGroup as NavGroupId } from "@/components/prod/shell/shared/types/module";

import type { ComponentType, SVGProps } from "react";

import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { cn } from "@/components/prod/utils/cn";

import { useSidebarContext } from "../../hooks/use-sidebar-context";
import { SidebarItem } from "../sidebar-item";

interface NavGroupItem {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
}

interface NavGroupProps {
  id: NavGroupId;
  isActive: boolean;
  isExpanded: boolean;
  items: NavGroupItem[];
  label: string;
  onToggle: (id: NavGroupId) => void;
}

const NavGroup = ({
  id,
  isActive,
  isExpanded,
  items,
  label,
  onToggle,
}: NavGroupProps) => {
  const { isCollapsed } = useSidebarContext();

  const handleToggle = () => {
    onToggle(id);
  };

  const itemList = (
    <ul className="w-full" data-testid={`sidebar-group-${id}-items`}>
      {items.map((item) => (
        <li className="px-3 py-1" key={item.title}>
          <SidebarItem {...item} />
        </li>
      ))}
    </ul>
  );

  /*
   * When the rail is collapsed to icons there is no room for group headers, so
   * every item stays visible to keep navigation reachable.
   */
  if (isCollapsed) {
    return itemList;
  }

  const Chevron = isExpanded ? ChevronDownIcon : ChevronRightIcon;
  const isActiveWhileCollapsed = !isExpanded && isActive;

  return (
    <div>
      <h2 className="mb-2 h-3.5">
        <button
          aria-expanded={isExpanded}
          className={cn(
            "flex h-full w-full items-center justify-between px-5 text-xs font-medium tracking-wider uppercase transition-colors",
            isActiveWhileCollapsed
              ? "text-gray-800"
              : "text-text-muted hover:text-gray-800"
          )}
          data-testid={`sidebar-group-${id}`}
          onClick={handleToggle}
          type="button"
        >
          <span>{label}</span>
          <Chevron aria-hidden className="size-3.5 shrink-0" />
        </button>
      </h2>
      {isExpanded && itemList}
    </div>
  );
};

export { NavGroup, type NavGroupItem };
