import type { Role } from "@/components/prod/utils/session/store/types";
import type { PositiveInteger } from "@/components/prod/utils/types/positive-integer";

import type { ComponentType, SVGProps } from "react";

interface ModuleConfig<Order extends number = number> {
  basePath: string;
  enabled?: boolean;
  group: NavGroup;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  id: string;
  navOrder: PositiveInteger<Order>;
  navSection: NavSection;
  roles: readonly Role[];
  title: string;
}

type NavGroup = "modules" | "tools";

type NavSection = "business" | "settings";

export type { ModuleConfig, NavGroup };
