import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { cn } from "@/components/prod/utils/cn";

const CollapsibleChevron = ({ className }: { className?: string }) => (
  <ChevronDownIcon
    aria-label="Toggle collapsible"
    className={cn(
      "size-4 transition-transform duration-200 group-data-[state=open]/collapsible-trigger:rotate-180",
      className
    )}
  />
);

export { CollapsibleChevron };
