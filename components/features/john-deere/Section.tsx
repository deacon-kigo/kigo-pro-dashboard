import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/prod/badge";
import { cn } from "@/components/prod/utils/cn";

interface SectionProps {
  icon: LucideIcon;
  title: string;
  count?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Section = ({
  action,
  children,
  className,
  count,
  description,
  icon: Icon,
  title,
}: SectionProps) => (
  <section className={cn("px-5 py-4", className)}>
    <div className="flex shrink-0 items-start gap-3">
      <span
        aria-hidden
        className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600 [&_svg]:size-4"
      >
        <Icon />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="flex items-center gap-2 text-base font-medium text-gray-900">
          {title}
          {count && (
            <Badge
              className="text-sm"
              color="neutral"
              size="sm"
              variant="outline"
            >
              {count}
            </Badge>
          )}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {action && (
        <div className="ml-auto flex shrink-0 items-center gap-2">{action}</div>
      )}
    </div>
    <div className="mt-3 min-h-0 flex-1">{children}</div>
  </section>
);

export { Section, type SectionProps };
