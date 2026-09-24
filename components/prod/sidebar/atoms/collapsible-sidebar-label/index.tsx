import type { ButtonSidebarLabelProps } from "../sidebar-label";

import { useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname } from "@/components/prod/_runtime/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/prod/collapsible";
import { cn } from "@/components/prod/utils/cn";

import { useSidebarContext } from "../../hooks/use-sidebar-context";
import { SidebarLabel } from "../sidebar-label";

interface CollapsibleSidebarLabelProps extends Omit<
  ButtonSidebarLabelProps,
  "onClick"
> {
  subItems: {
    href: string;
    title: string;
  }[];
}

const CollapsibleSidebarLabel = ({
  subItems,
  ...props
}: CollapsibleSidebarLabelProps) => {
  if (subItems.length === 0) {
    throw new Error("Sub items array cannot be empty");
  }

  const { isCollapsed } = useSidebarContext();
  const pathname = usePathname();
  const isActive = subItems.some((item) => pathname.startsWith(item.href));
  const [isOpen, setIsOpen] = useState(isActive);

  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Collapsible
      className="w-full"
      data-testid="collapsible-sidebar-label"
      open={isOpen}
    >
      <CollapsibleTrigger asChild className="w-full">
        <div className="relative">
          <SidebarLabel
            isActive={isActive}
            onClick={handleOpenChange}
            {...props}
          />
          <ChevronDownIcon
            className={cn(
              "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 transition-transform",
              isCollapsed ? "hidden" : "",
              isOpen ? "rotate-180" : ""
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        asChild
        className={cn(
          "mt-1 ml-5 border-l border-gray-200 pl-3",
          isCollapsed ? "hidden" : ""
        )}
      >
        <ul>
          {subItems.map((item) => (
            <li key={item.href}>
              <SidebarLabel
                className="h-auto"
                href={item.href}
                title={item.title}
              />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { CollapsibleSidebarLabel };
